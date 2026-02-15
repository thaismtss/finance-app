"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategorySettings } from "@/components/settings/category-settings";
import { PaymentMethodSettings } from "@/components/settings/payment-method-settings";

export default function SettingsPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Configurações</h1>

            <Tabs defaultValue="categories" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="categories">Categorias</TabsTrigger>
                    <TabsTrigger value="payment-methods">Formas de Pagamento</TabsTrigger>
                </TabsList>
                <TabsContent value="categories">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gerenciar Categorias</CardTitle>
                            <CardDescription>
                                Adicione, edite ou remova categorias para organizar suas transações.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CategorySettings />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="payment-methods">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gerenciar Formas de Pagamento</CardTitle>
                            <CardDescription>
                                Configure suas contas bancárias, cartões ou outras formas de pagamento.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PaymentMethodSettings />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
