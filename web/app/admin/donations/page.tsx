import DashboardLayout from "@/components/admin/DashboardLayout";

export default function DonationsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-8 text-center">
                    <h2 className="text-2xl font-cinzel-decorative font-bold text-primary-dark mb-4">
                        Donations Management
                    </h2>
                    <p className="text-primary/70 mb-6">
                        This page will display donation records, filtering, and CRUD operations.
                    </p>
                    <div className="inline-block px-4 py-2 bg-secondary/10 text-secondary-dark rounded-lg">
                        🚧 Under Construction
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
