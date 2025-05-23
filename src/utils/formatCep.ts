export function formatCep(value?: string) {
	if (!value) return "";
	return value.replace(/(\d{5})(\d)/, "$1-$2").replace(/(-\d{3})\d+?$/, "$1");
}
