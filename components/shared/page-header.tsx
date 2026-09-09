export function PageHeader({ eyebrow = 'YOUR MONEY, YOUR WAY', title, description, actions }: {
    eyebrow?: string;
    title: string;
    description: string;
    actions?: React.ReactNode;
}) { return <header className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="muted">{description}</p></div>{actions && <div className="actions">{actions}</div>}</header>; }
