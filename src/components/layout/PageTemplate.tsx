import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageTemplateProps {
  title: string;
  breadcrumb: BreadcrumbItem[];
  children: React.ReactNode;
}

export function PageTemplate({ title, breadcrumb, children }: PageTemplateProps) {
  return (
    <div className="mx-auto max-w-container px-6 py-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap gap-2 text-sm text-hertz-black-60">
          {breadcrumb.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {item.href ? (
                <Link href={item.href} className="hover:text-black hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-black">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <div className="border-b border-hertz-border pb-8">
        <h1 className="text-3xl font-bold text-black lg:text-4xl">{title}</h1>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
