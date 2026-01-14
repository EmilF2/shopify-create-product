export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const SHOP = "567680-2.myshopify.com";
  const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
  const API_VERSION = "2026-01";

  const query = `
    mutation productCreate($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
        }
        userErrors {
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      title: "Product Created From Storefront",
      status: "DRAFT"
    }
  };

  const response = await fetch(
    `https://${SHOP}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": TOKEN
      },
      body: JSON.stringify({ query, variables })
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
