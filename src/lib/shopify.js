import { createStorefrontApiClient } from '@shopify/storefront-api-client';

// Shopify Storefront API configuration
// Replace these with your actual values
const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'ampume.myshopify.com';
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';

export const shopifyClient = createStorefrontApiClient({
  storeDomain: SHOPIFY_STORE_DOMAIN,
  apiVersion: '2024-01',
  // shpss_ tokens are private Storefront API tokens
  privateAccessToken: SHOPIFY_STOREFRONT_TOKEN,
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

// Helper to extract error message from various error formats
function getErrorMessage(errors) {
  if (!errors) return 'Unknown error';
  if (typeof errors === 'string') return errors;
  if (Array.isArray(errors)) return errors.map(e => e.message || String(e)).join(', ');
  if (errors.message) return errors.message;
  if (errors.graphQLErrors) return errors.graphQLErrors.map(e => e.message).join(', ');
  if (errors.networkStatusCode) return `Network error: ${errors.networkStatusCode}`;
  return JSON.stringify(errors);
}

// Helper functions
export async function fetchProducts(first = 50, after = null) {
  try {
    const response = await shopifyClient.request(PRODUCTS_QUERY, {
      variables: { first, after },
    });

    if (response.errors) {
      console.error('Error fetching products:', response.errors);
      throw new Error(getErrorMessage(response.errors));
    }

    return response.data?.products;
  } catch (err) {
    console.error('fetchProducts error:', err);
    throw err;
  }
}

export async function fetchProductByHandle(handle) {
  try {
    const response = await shopifyClient.request(PRODUCT_BY_HANDLE_QUERY, {
      variables: { handle },
    });

    if (response.errors) {
      console.error('Error fetching product:', response.errors);
      throw new Error(getErrorMessage(response.errors));
    }

    return response.data?.productByHandle;
  } catch (err) {
    console.error('fetchProductByHandle error:', err);
    throw err;
  }
}

export async function createCart(lines = []) {
  try {
    const response = await shopifyClient.request(CREATE_CART_MUTATION, {
      variables: { lines },
    });

    if (response.errors) {
      console.error('Error creating cart:', response.errors);
      throw new Error(getErrorMessage(response.errors));
    }

    const data = response.data;
    if (data?.cartCreate?.userErrors?.length > 0) {
      throw new Error(data.cartCreate.userErrors.map(e => e.message).join(', '));
    }

    return data?.cartCreate?.cart;
  } catch (err) {
    console.error('createCart error:', err);
    throw err;
  }
}

export async function getCart(cartId) {
  try {
    const response = await shopifyClient.request(GET_CART_QUERY, {
      variables: { cartId },
    });

    if (response.errors) {
      console.error('Error fetching cart:', response.errors);
      throw new Error(getErrorMessage(response.errors));
    }

    return response.data?.cart;
  } catch (err) {
    console.error('getCart error:', err);
    throw err;
  }
}

export async function addToCart(cartId, lines) {
  try {
    const response = await shopifyClient.request(ADD_TO_CART_MUTATION, {
      variables: { cartId, lines },
    });

    if (response.errors) {
      console.error('Error adding to cart:', response.errors);
      throw new Error(getErrorMessage(response.errors));
    }

    const data = response.data;
    if (data?.cartLinesAdd?.userErrors?.length > 0) {
      throw new Error(data.cartLinesAdd.userErrors.map(e => e.message).join(', '));
    }

    return data?.cartLinesAdd?.cart;
  } catch (err) {
    console.error('addToCart error:', err);
    throw err;
  }
}

export async function updateCartLine(cartId, lines) {
  try {
    const response = await shopifyClient.request(UPDATE_CART_MUTATION, {
      variables: { cartId, lines },
    });

    if (response.errors) {
      console.error('Error updating cart:', response.errors);
      throw new Error(getErrorMessage(response.errors));
    }

    const data = response.data;
    if (data?.cartLinesUpdate?.userErrors?.length > 0) {
      throw new Error(data.cartLinesUpdate.userErrors.map(e => e.message).join(', '));
    }

    return data?.cartLinesUpdate?.cart;
  } catch (err) {
    console.error('updateCartLine error:', err);
    throw err;
  }
}

export async function removeFromCart(cartId, lineIds) {
  try {
    const response = await shopifyClient.request(REMOVE_FROM_CART_MUTATION, {
      variables: { cartId, lineIds },
    });

    if (response.errors) {
      console.error('Error removing from cart:', response.errors);
      throw new Error(getErrorMessage(response.errors));
    }

    const data = response.data;
    if (data?.cartLinesRemove?.userErrors?.length > 0) {
      throw new Error(data.cartLinesRemove.userErrors.map(e => e.message).join(', '));
    }

    return data?.cartLinesRemove?.cart;
  } catch (err) {
    console.error('removeFromCart error:', err);
    throw err;
  }
}

// Price formatting helper
export function formatPrice(amount, currencyCode = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}
