import { OrganizationData, ServiceData, FaqData } from "@/types";
import { generateJsonLdSchema } from "@/lib/seoGenerator";

interface StructuredDataProps {
  organization: OrganizationData | null;
  services?: ServiceData[];
  faqs?: FaqData[];
}

export default function StructuredData({
  organization,
  services = [],
  faqs = [],
}: StructuredDataProps) {
  const { orgSchema, faqSchema } = generateJsonLdSchema({
    organization,
    services,
    faqs,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
