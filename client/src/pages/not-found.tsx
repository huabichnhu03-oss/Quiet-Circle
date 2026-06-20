import { Card, CardContent } from "@/components/ui/card";
import { IconAlert } from "@/components/Icons";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <IconAlert size={32} color="#ef4444" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>

          <Link href="/">
            <button
              type="button"
              data-testid="button-not-found-home"
              className="mt-6 w-full py-3 rounded-xl text-sm font-semibold text-white btn-gradient"
            >
              Go Home
            </button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
