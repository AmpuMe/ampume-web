import { createStorefrontApiClient } from '@shopify/storefront-api-client';

// Shopify Storefront API configuration
// Replace these with your actual values
const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'ampume.myshopify.com';
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';

export const shopifyClient = createStorefrontApiClient({
  storeDomain: SHOPIFY_STORE_DOMAIN,
  apiVersion: '2024-01',
  publicAccessToken: SHOPIFY_STOREFRONT_TOKEN,
});

// GraphQL Queries
export const PRODUCTS_QUERY = `
  query Products($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          productType
          tags
          vendor
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            id
            name
            values
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      productType
      tags
      vendor
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
          }
        }
      }
      options {
        id
        name
        values
      }
    }
  }
`;

export const CREATE_CART_MUTATION = `
  mutation CreateCart($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const GET_CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  title
                  handle
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
    }
  }
`;

export const ADD_TO_CART_MUTATION = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const UPDATE_CART_MUTATION = `
  mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const REMOVE_FROM_CART_MUTATION = `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Helper functions
export async function fetchProducts(first = 50, after = null) {
  const { data, errors } = await shopifyClient.request(PRODUCTS_QUERY, {
    variables: { first, after },
  });

  if (errors) {
    console.error('Error fetching products:', errors);
    throw new Error(errors.map(e => e.message).join(', '));
  }

  return data?.products;
}

export async function fetchProductByHandle(handle) {
  const { data, errors } = await shopifyClient.request(PRODUCT_BY_HANDLE_QUERY, {
    variables: { handle },
  });

  if (errors) {
    console.error('Error fetching product:', errors);
    throw new Error(errors.map(e => e.message).join(', '));
  }

  return data?.productByHandle;
}

export async function createCart(lines = []) {
  const { data, errors } = await shopifyClient.request(CREATE_CART_MUTATION, {
    variables: { lines },
  });

  if (errors) {
    console.error('Error creating cart:', errors);
    throw new Error(errors.map(e => e.message).join(', '));
  }

  if (data?.cartCreate?.userErrors?.length > 0) {
    throw new Error(data.cartCreate.userErrors.map(e => e.message).join(', '));
  }

  return data?.cartCreate?.cart;
}

export async function getCart(cartId) {
  const { data, errors } = await shopifyClient.request(GET_CART_QUERY, {
    variables: { cartId },
  });

  if (errors) {
    console.error('Error fetching cart:', errors);
    throw new Error(errors.map(e => e.message).join(', '));
  }

  return data?.cart;
}

export async function addToCart(cartId, lines) {
  const { data, errors } = await shopifyClient.request(ADD_TO_CART_MUTATION, {
    variables: { cartId, lines },
  });

  if (errors) {
    console.error('Error adding to cart:', errors);
    throw new Error(errors.map(e => e.message).join(', '));
  }

  if (data?.cartLinesAdd?.userErrors?.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors.map(e => e.message).join(', '));
  }

  return data?.cartLinesAdd?.cart;
}

export async function updateCartLine(cartId, lines) {
  const { data, errors } = await shopifyClient.request(UPDATE_CART_MUTATION, {
    variables: { cartId, lines },
  });

  if (errors) {
    console.error('Error updating cart:', errors);
    throw new Error(errors.map(e => e.message).join(', '));
  }

  if (data?.cartLinesUpdate?.userErrors?.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors.map(e => e.message).join(', '));
  }

  return data?.cartLinesUpdate?.cart;
}

export async function removeFromCart(cartId, lineIds) {
  const { data, errors } = await shopifyClient.request(REMOVE_FROM_CART_MUTATION, {
    variables: { cartId, lineIds },
  });

  if (errors) {
    console.error('Error removing from cart:', errors);
    throw new Error(errors.map(e => e.message).join(', '));
  }

  if (data?.cartLinesRemove?.userErrors?.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors.map(e => e.message).join(', '));
  }

  return data?.cartLinesRemove?.cart;
}

// Price formatting helper
export function formatPrice(amount, currencyCode = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}
