function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

let inputBorderColor = `#ced4da`;
function loginInputValidation() {
  $("input[required]").on("keyup focus", async (e) => {
    await $(`.${e.currentTarget.name}-error`).remove();

    if (e.currentTarget.value.length === 0) {
      parentNode = e.currentTarget.parentNode;

      let errorMessage = document.createElement("span");

      errorMessage.className = `${e.currentTarget.name}-error`;
      errorMessage.style.fontSize = `13px`;
      errorMessage.style.color = `red`;
      errorMessage.style.marginLeft = `4px`;
      errorMessage.style.marginTop = `-4px`;
      e.currentTarget.style.borderColor = `red`;

      e.currentTarget.nextElementSibling.firstElementChild.style.borderColor = `red`;
      errorMessage.innerHTML = "Ce champ est obligatoire";

      insertAfter(errorMessage, parentNode);
    } else {
      await $(`.${e.currentTarget.name}-error`).remove();
      e.currentTarget.style.borderColor = inputBorderColor;
      e.currentTarget.nextElementSibling.firstElementChild.style.borderColor =
        inputBorderColor;
    }
  });
}

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

function InputValidation() {
  $("input[required]").on("keyup focus", async (e) => {
    await $(`.${e.currentTarget.name}-error`).remove();

    const isValid = Array.from(e.target.attributes).some((attr) => {
      if (attr.name === "type") {
        switch (attr.value) {
          case "text":
           
          case "number":
            return isNaN(e.target.value);
          case "email":
            return validateEmail(e.target.value);
          default:
            return;
        }
      }
    });


    if (e.currentTarget.value.length === 0) {
      parentNode = e.currentTarget.parentNode;

      let errorMessage = document.createElement("span");

      errorMessage.className = `${e.currentTarget.name}-error`;
      errorMessage.style.fontSize = `13px`;
      errorMessage.style.color = `red`;
      errorMessage.style.marginLeft = `4px`;
      errorMessage.style.marginTop = `-4px`;
      e.currentTarget.style.borderColor = `red`;

      errorMessage.innerHTML = "Ce champ est obligatoire";
      parentNode.append(errorMessage);
      // insertAfter(errorMessage, parentNode);
    } else {
      await $(`.${e.currentTarget.name}-error`).remove();
      e.currentTarget.style.borderColor = inputBorderColor;
    }
  });
}

function disableButton() {
  $("button").attr("disabled", "disabled");
  $(document).ready(function () {
    $("input[required]").keyup(function () {
      var empty = false;
      $("input[required]").each(function () {
        if ($(this).val().length == 0) {
          empty = true;
        }
      });

      if (empty) {
        $("button").attr("disabled", "disabled");
      } else {
        $("button").attr("disabled", false);
      }
    });
  });
}
