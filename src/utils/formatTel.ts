export function formatTelefone(value: string): string {
	const numeros = value.replace(/\D/g, "");

	if (numeros.length <= 10) {
		// Formato: (99) 9999-9999
		return numeros
			.replace(/^(\d{2})(\d)/, "($1) $2")
			.replace(/(\d{4})(\d{1,4})$/, "$1-$2");
	} else {
		// Formato: (99) 99999-9999
		return numeros
			.replace(/^(\d{2})(\d)/, "($1) $2")
			.replace(/(\d{5})(\d{1,4})$/, "$1-$2");
	}
}
