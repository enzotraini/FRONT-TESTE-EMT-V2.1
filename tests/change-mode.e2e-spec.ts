import test, { expect } from "@playwright/test";

test("Should be able to change the mode", async ({ page }) => {
	await page.goto("/");

	await page.getByRole("button", { name: "Username" }).click();

	await page.getByRole("menuitem", { name: "Trocar tema" }).click();

	await page.getByRole("menuitem", { name: "Escuro" }).click();

	let html = page.locator("html");
	await expect(html).toHaveClass(/dark/);
	await expect(html).not.toHaveClass(/light/);

	await page.getByRole("button", { name: "Username" }).click();

	await page.getByRole("menuitem", { name: "Trocar tema" }).click();

	await page.getByRole("menuitem", { name: "Claro" }).click();

	html = page.locator("html");
	await expect(html).toHaveClass(/light/);
	await expect(html).not.toHaveClass(/dark/);
});
