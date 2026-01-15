export default async function handler(req, res) {
  try {
    const title = req.query?.title || "Untitled Product";
  
    const SHOP = "567680-2.myshopify.com";
    const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
    const API_VERSION = "2026-01";

    const query = `
        query CheckProductTitle($title: String!) {
          products(first: 1, query: $title) {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      `;

    const queryVariables = {
      title: title,
    };

    const queryResponse = await fetch(
      `https://${SHOP}/admin/api/${API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": TOKEN
        },
        body: JSON.stringify({ 
          query, 
          variables: queryVariables 
        })
      }
    );

    const mutate = `
        mutation productCreate($input: ProductInput!) {
          productCreate(input: $input) {
            product { id title }
            userErrors { field message }
          }
        }
      `;

    const mutateVariables = {
      input: {
        title: title,
        status: "DRAFT"
      }
    };

    const mutateResponse = await fetch(
      `https://${SHOP}/admin/api/${API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": TOKEN
        },
        body: JSON.stringify({ 
          query: mutate, 
          variables: mutateVariables 
        })
      }
    );

    const data = await queryResponse.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Shopify request failed:", err);
    return res.status(500).json({ error: err.message });
  }
}
