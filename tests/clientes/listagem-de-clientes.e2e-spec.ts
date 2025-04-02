import test, { expect } from "@playwright/test";

test("Should be able to navigate on clients", async ({ page }) => {
	await page.goto("/cadastros/clientes");

	let first = page
		.getByRole("cell", { name: "Cliente 1", exact: true })
		.first();

	let last = page.getByRole("cell", { name: "Cliente 10" }).first();

	await expect(first).toBeVisible();
	await expect(last).toBeVisible();

	await page.getByLabel("Go to next page").click();

	first = page.getByRole("cell", { name: "Cliente 11", exact: true }).first();

	last = page.getByRole("cell", { name: "Cliente 20" }).first();

	await expect(first).toBeVisible();
	await expect(last).toBeVisible();

	await page.getByLabel("Go to previous page").click();

	first = page.getByRole("cell", { name: "Cliente 1", exact: true }).first();

	last = page.getByRole("cell", { name: "Cliente 10" }).first();

	await expect(first).toBeVisible();
	await expect(last).toBeVisible();

	await page.getByRole("button", { name: "10" }).click();

	const clients = page.locator("table").locator("tbody").locator("tr");
	await expect(clients).toHaveCount(7);

	await page.getByLabel("Go to previous page").click();

	first = page.getByRole("cell", { name: "Cliente 81", exact: true }).first();

	last = page.getByRole("cell", { name: "Cliente 90" }).first();

	await expect(first).toBeVisible();
	await expect(last).toBeVisible();

	await page.getByRole("button", { name: "1", exact: true }).click();

	first = page.getByRole("cell", { name: "Cliente 1", exact: true }).first();

	last = page.getByRole("cell", { name: "Cliente 10" }).first();

	await expect(first).toBeVisible();
	await expect(last).toBeVisible();
});

test("Should be able to search for clients", async ({ page }) => {
	await page.goto("/cadastros/clientes");

	await page.getByPlaceholder("Pesquisar").fill("cliente 1");

	await page.keyboard.press("Enter");

	const clients = page.locator("table").locator("tbody").locator("tr");
	await expect(clients).toHaveCount(11);
	await expect(page.getByRole("cell", { name: "Cliente 18" })).toBeVisible();
	await expect(
		page.getByRole("cell", { name: "Cliente 1", exact: true }),
	).toBeVisible();

	await page.getByRole("button", { name: "2" }).click();

	await expect(page.getByRole("cell", { name: "Cliente 19" })).toBeVisible();

	await page.getByPlaceholder("Pesquisar").fill("cliente");

	await page.keyboard.press("Enter");

	await expect(clients).toHaveCount(11);
	await expect(
		page.getByRole("cell", { name: "Cliente 1", exact: true }),
	).toBeVisible();
	await expect(page.getByRole("cell", { name: "Cliente 10" })).toBeVisible();

	await page.getByPlaceholder("Pesquisar").fill("cliente 11");

	await page.keyboard.press("Enter");

	await expect(clients).toHaveCount(2);

	await page.getByPlaceholder("Pesquisar").fill("cliente 100");

	await page.keyboard.press("Enter");

	await expect(clients).toHaveCount(2);
	await expect(
		page.getByRole("cell", { name: "Nenhum registro encontrado" }),
	).toBeVisible();
});

test("Should be able to check an line in clients list", async ({ page }) => {
	await page.goto("/cadastros/clientes");

	await expect(page.getByText("0 registros selecionados")).toBeVisible();

	await page
		.getByRole("row", { name: "Select row 1 Cliente 1" })
		.getByLabel("Select row")
		.click();

	await expect(page.getByText("1 registros selecionados")).toBeVisible();

	await expect(page.getByLabel("Select all")).not.toBeChecked();

	for (let i = 2; i <= 10; i++) {
		await page
			.getByRole("row", { name: `Select row ${i} Cliente ${i}` })
			.getByLabel("Select row")
			.click();
	}

	await expect(page.getByLabel("Select all")).toBeChecked();

	await page.getByLabel("Go to next page").click();

	await expect(page.getByLabel("Select all")).not.toBeChecked();

	await page
		.getByRole("row", { name: "Select row 11 Cliente 11" })
		.getByLabel("Select row")
		.click();

	await expect(page.getByLabel("Select all")).not.toBeChecked();
	await expect(page.getByText("1 registros selecionados")).toBeVisible();

	await page.getByLabel("Select all").click();

	await expect(page.getByText("10 registros selecionados")).toBeVisible();

	await page.getByLabel("Select all").click();

	await expect(page.getByText("0 registros selecionados")).toBeVisible();
});
