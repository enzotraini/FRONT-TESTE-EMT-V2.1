import test, { expect } from "@playwright/test";

test("Should be able to sign-in with an valid user", async ({ page }) => {
	await page.goto("/auth/sign-in");

	await page.getByPlaceholder("E-mail").fill("johndoe@example.com");
	await page.getByPlaceholder("Senha").fill("secret");

	await page.getByRole("button", { name: "Entrar no sistema" }).click();

	const title = page.getByRole("heading", {
		name: "Comercial Aço Fácil",
	});

	await title.waitFor({ timeout: 2000 });

	await expect(title).toBeVisible();
});

test("Should not be able to sign-in with an invalid user", async ({ page }) => {
	await page.goto("/auth/sign-in");

	await page.getByPlaceholder("E-mail").fill("wrong@example.com");
	await page.getByPlaceholder("Senha").fill("wrong");

	await page.getByRole("button", { name: "Entrar no sistema" }).click();

	const errorMessage = page.getByText("Crendeciais inválidas");

	await errorMessage.waitFor({ timeout: 2000 });

	await expect(errorMessage).toBeVisible();
});
