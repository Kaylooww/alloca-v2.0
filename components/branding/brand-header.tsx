import { AllocaLogo } from './alloca-logo';
import { AllocaWordmark } from './alloca-wordmark';
export function BrandHeader({ tagline = true }: {
    tagline?: boolean;
}) { return <a className="brand" href="/dashboard" aria-label="Alloca home"><AllocaLogo /><span><AllocaWordmark />{tagline && <span className="brand-tagline">Give every money a purpose</span>}</span></a>; }
