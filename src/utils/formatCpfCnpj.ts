export function formatCpfCnpj(value: string | undefined | null) {
	const cleanedValue = (value ?? "").replace(/\D/g, "");

	if (cleanedValue.length <= 11) {
		return formatCpf(cleanedValue);
	}
	return formatCnpj(cleanedValue);
}

export function formatCpf(value: string) {
	return value
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{1,2})/, "$1-$2")
		.replace(/(-\d{2})\d+?$/, "$1");
}

export function formatCnpj(value: string) {
	return value
		.replace(/(\d{2})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1/$2")
		.replace(/(\d{4})(\d)/, "$1-$2")
		.replace(/(-\d{2})\d+?$/, "$1");
}
