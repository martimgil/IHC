import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { FaArrowLeft } from 'react-icons/fa6';

/**
 * Consistent sticky back button used across all pages.
 * Sticks to the top of the scroll area, flush under the navbar.
 */
export default function StickyBackButton({ to }: { readonly to?: string }) {
    const navigate = useNavigate();

    return (
        <div className="sticky top-0 z-10 bg-background -mx-4 px-4 pb-2 pt-1 border-b border-border/50">
            <Button
                variant="ghost"
                onClick={() => (to ? navigate(to) : navigate(-1))}
                className="-ml-2 min-h-[44px]"
                aria-label="Voltar à página anterior"
            >
                <FaArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                Voltar
            </Button>
        </div>
    );
}
