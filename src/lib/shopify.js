// Shopify Storefront API - proxied through /api/shopify serverless function
// This keeps the private token server-side

async function shopifyFetch(query, variables = {}) {
  const response = await fetch('/api/shopify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors) {
    console.error('Shopify GraphQL errors:', json.errors);
    const message = json.errors.map(e => e.message).join(', ');
    throw new Error(message);
  }

  return json.data;
}

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
  const data = await shopifyFetch(PRODUCTS_QUERY, { first, after });
  return data?.products;
}

export async function fetchProductByHandle(handle) {
  const data = await shopifyFetch(PRODUCT_BY_HANDLE_QUERY, { handle });
  return data?.productByHandle;
}

export async function createCart(lines = []) {
  const data = await shopifyFetch(CREATE_CART_MUTATION, { lines });
  if (data?.cartCreate?.userErrors?.length > 0) {
    throw new Error(data.cartCreate.userErrors.map(e => e.message).join(', '));
  }
  return data?.cartCreate?.cart;
}

export async function getCart(cartId) {
  const data = await shopifyFetch(GET_CART_QUERY, { cartId });
  return data?.cart;
}

export async function addToCart(cartId, lines) {
  const data = await shopifyFetch(ADD_TO_CART_MUTATION, { cartId, lines });
  if (data?.cartLinesAdd?.userErrors?.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors.map(e => e.message).join(', '));
  }
  return data?.cartLinesAdd?.cart;
}

export async function updateCartLine(cartId, lines) {
  const data = await shopifyFetch(UPDATE_CART_MUTATION, { cartId, lines });
  if (data?.cartLinesUpdate?.userErrors?.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors.map(e => e.message).join(', '));
  }
  return data?.cartLinesUpdate?.cart;
}

export async function removeFromCart(cartId, lineIds) {
  const data = await shopifyFetch(REMOVE_FROM_CART_MUTATION, { cartId, lineIds });
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

// Product grouping utilities

export function extractBaseName(title) {
  const dashIndex = title.indexOf(' - ');
  if (dashIndex !== -1) return title.substring(0, dashIndex).trim();
  const slashIndex = title.indexOf(' / ');
  if (slashIndex !== -1) return title.substring(0, slashIndex).trim();
  return title;
}

export function extractVariantLabel(title, baseName) {
  if (title === baseName) return null;
  const remainder = title.substring(baseName.length).trim();
  return remainder.replace(/^[-/]\s*/, '').trim() || null;
}

export function groupProducts(products) {
  const groupMap = new Map();

  for (const product of products) {
    const baseName = extractBaseName(product.title);
    if (!groupMap.has(baseName)) {
      groupMap.set(baseName, {
        baseName,
        productType: product.productType,
        vendor: product.vendor,
        products: [],
        primaryProduct: product,
        handles: [],
      });
    }
    const group = groupMap.get(baseName);
    group.products.push(product);
    group.handles.push(product.handle);
  }

  for (const group of groupMap.values()) {
    const prices = group.products
      .map(p => parseFloat(p.priceRange?.minVariantPrice?.amount || '0'))
      .filter(p => p > 0);
    group.minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    group.maxPrice = prices.length > 0
      ? Math.max(...group.products.map(p => parseFloat(p.priceRange?.maxVariantPrice?.amount || '0')))
      : 0;
    group.optionCount = group.products.length;
  }

  return Array.from(groupMap.values());
}

export const CATEGORY_ORDER = [
  {
    key: 'Prosthetic Liner',
    label: 'Prosthetic Liners',
    id: 'liners',
    description: 'Cushion and locking liners from trusted manufacturers, available in multiple sizes and configurations.',
    icon: 'Shield',
  },
  {
    key: 'Prosthetic Sock',
    label: 'Prosthetic Socks',
    id: 'socks',
    description: 'Ply socks for volume management and comfort throughout the day.',
    icon: 'Layers',
  },
  {
    key: 'Prosthetic Sleeve',
    label: 'Prosthetic Sleeves',
    id: 'sleeves',
    description: 'Suspension sleeves to keep your prosthesis secure and comfortable.',
    icon: 'Grip',
  },
  {
    key: 'Prosthetic Accessory',
    label: 'Accessories',
    id: 'accessories',
    description: 'Cleaners, lubricants, and other supplies to maintain your prosthetic.',
    icon: 'Package',
  },
  {
    key: 'Performance & Recovery',
    label: 'Performance & Recovery',
    id: 'performance-recovery',
    description: 'Products to support your active lifestyle, rehabilitation, and recovery.',
    icon: 'Activity',
  },
];

export function getCategoryById(id) {
  return CATEGORY_ORDER.find(cat => cat.id === id) || null;
}

export function getCategoryByProductType(productType) {
  return CATEGORY_ORDER.find(cat => cat.key === productType) || null;
}

export function categorizeGroups(groups) {
  const categories = [];
  const matched = new Set();

  for (const cat of CATEGORY_ORDER) {
    const catGroups = groups.filter(g => g.productType === cat.key);
    if (catGroups.length > 0) {
      categories.push({ ...cat, groups: catGroups });
      catGroups.forEach(g => matched.add(g.baseName));
    }
  }

  const other = groups.filter(g => !matched.has(g.baseName));
  if (other.length > 0) {
    categories.push({ key: 'Other', label: 'Other Products', id: 'other', groups: other });
  }

  return categories;
}

// Fetch products filtered by Shopify product type
const PRODUCTS_BY_TYPE_QUERY = `
  query ProductsByType($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
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

export async function fetchProductsByType(productType, first = 50) {
  const data = await shopifyFetch(PRODUCTS_BY_TYPE_QUERY, {
    query: `product_type:'${productType}'`,
    first,
  });
  return data?.products?.edges?.map(edge => edge.node) || [];
}
