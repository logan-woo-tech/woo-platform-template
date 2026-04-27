import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@template/ui';
import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';

export default function PlaygroundPage() {
  if (process.env.NEXT_PUBLIC_ENV !== 'development') {
    notFound();
  }

  const t = useTranslations('playground');

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t('buttons_section')}</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="sm">
            Primary Small
          </Button>
          <Button variant="primary" size="md">
            Primary Medium
          </Button>
          <Button variant="primary" size="lg">
            Primary Large
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t('inputs_section')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <Input label="Email" type="email" placeholder="you@example.com" />
          <Input label="Password" type="password" />
          <Input label="With Error" error="This field is required" />
          <Input label="Disabled" disabled defaultValue="Cannot edit" />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t('cards_section')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
              <CardDescription>This is a basic card with header and content.</CardDescription>
            </CardHeader>
            <CardContent>Card content goes here. Can include any children.</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card with Action</CardTitle>
              <CardDescription>Includes a button.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Click me</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
