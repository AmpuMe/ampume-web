import { PortableText } from '@portabletext/react';

const components = {
  block: {
    h2: ({ children }) => <h2 className="text-2xl font-medium mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-medium mt-6 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-medium mt-4 mb-2">{children}</h4>,
    normal: ({ children }) => <p className="text-gray-600 leading-relaxed mb-4">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-brand-gold pl-4 italic text-gray-500 my-6">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-black">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const rel = !value.href?.startsWith('/') ? 'noopener noreferrer' : undefined;
      const target = !value.href?.startsWith('/') ? '_blank' : undefined;
      return (
        <a href={value.href} rel={rel} target={target} className="underline text-black hover:text-gray-600 transition-colors">
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-600">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5 space-y-2 mb-4 text-gray-600">{children}</ol>,
  },
};

export default function PortableTextRenderer({ value }) {
  if (!value || !Array.isArray(value)) return null;
  return <PortableText value={value} components={components} />;
}
