export const runtime = 'edge';
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const message = typeof params?.message === 'string' ? params.message : null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-900">Connexion</CardTitle>
          <CardDescription>Accédez à votre espace sécurisé.</CardDescription>
        </CardHeader>
        <form action={login}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input id="email" name="email" type="email" required placeholder="nom@exemple.com" />
            </div>
            <div className="space-y-2">
               <Label htmlFor="password">Mot de passe</Label>
               <Input id="password" name="password" type="password" required />
            </div>
            {message && (
              <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">{message}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit">Se connecter</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
