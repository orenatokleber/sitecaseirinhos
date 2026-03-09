import { useState, useEffect } from "react";
import { useSiteSettings, useUpdateSiteSetting } from "@/hooks/useSiteContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";

const AdminConfig = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();

  const [contact, setContact] = useState({
    phone: "",
    email: "",
    address: "",
    instagram: "",
    whatsapp: ""
  });

  const [hours, setHours] = useState({
    weekdays: "",
    delivery: ""
  });

  useEffect(() => {
    if (settings?.contact) {
      setContact(settings.contact);
    }
    if (settings?.hours) {
      setHours(settings.hours);
    }
  }, [settings]);

  const handleSaveContact = () => {
    updateSetting.mutate({ key: 'contact', value: contact });
  };

  const handleSaveHours = () => {
    updateSetting.mutate({ key: 'hours', value: hours });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Atualize informações de contato e horários</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Contato</CardTitle>
            <CardDescription>WhatsApp, email, endereço e redes sociais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp (com DDD)</Label>
                <Input
                  id="whatsapp"
                  value={contact.whatsapp}
                  onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                  placeholder="5511999999999"
                />
                <p className="text-xs text-muted-foreground">Apenas números, com código do país</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  placeholder="5511999999999"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                placeholder="contato@caseirinhos.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={contact.address}
                onChange={(e) => setContact({ ...contact, address: e.target.value })}
                placeholder="Rua Exemplo, 123 - Cidade/UF"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={contact.instagram}
                onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
                placeholder="https://instagram.com/caseirinhos"
              />
            </div>

            <Button onClick={handleSaveContact} disabled={updateSetting.isPending}>
              {updateSetting.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Salvar Contato
            </Button>
          </CardContent>
        </Card>

        {/* Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Horário de Funcionamento</CardTitle>
            <CardDescription>Informe os horários de atendimento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weekdays">Horário Geral</Label>
              <Input
                id="weekdays"
                value={hours.weekdays}
                onChange={(e) => setHours({ ...hours, weekdays: e.target.value })}
                placeholder="Ter a Sáb: 11h – 18h"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery">Horário de Delivery</Label>
              <Input
                id="delivery"
                value={hours.delivery}
                onChange={(e) => setHours({ ...hours, delivery: e.target.value })}
                placeholder="Delivery a partir das 13h"
              />
            </div>

            <Button onClick={handleSaveHours} disabled={updateSetting.isPending}>
              {updateSetting.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Salvar Horários
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminConfig;
