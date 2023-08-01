

let message = {
    required: "Ce champ est obligatoire",
    minLength: (limit) => `Veuillez saisir au moins ${limit} caractères.`,
    maxLength: (limit) => `Veuillez saisir au maximum ${limit} caractères`,
    email: `Veuillez saisir une adresse électronique valide.`,
    length: (limit) => `Veuillez saisir ${limit} chaine de charatères numérique.`
}