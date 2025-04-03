import { Breadcrumbs } from '@/components/breadcrumbs';
import { fakeBoards } from '@/constants/mock-api';
import { Metadata } from 'next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Board Detayı | OgrenciMerkezi Admin',
  description: 'Board detaylarını görüntüleyin'
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function localizeType(type: string): string {
  switch (type) {
    case 'SCHOOL':
      return 'Üniversite';
    case 'CITY':
      return 'Şehir';
    case 'COUNTRY':
      return 'Ülke';
    case 'WORLD':
      return 'Dünya';
    default:
      return type;
  }
}

export default async function BoardDetailPage({
  params
}: {
  params: { id: string };
}) {
  const board = await fakeBoards.getBoard(params.id);

  if (!board) {
    notFound();
  }

  return (
    <div className='flex flex-col gap-8'>
      <Breadcrumbs
        segments={[
          {
            title: 'Dashboard',
            href: '/dashboard'
          },
          {
            title: 'Boards',
            href: '/boards'
          },
          {
            title: 'Board Detayı',
            href: `/boards/${params.id}`
          }
        ]}
      />

      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Link href='/boards'>
              <Button variant='ghost' size='sm' className='gap-1'>
                <ArrowLeft className='h-4 w-4' />
                Boards
              </Button>
            </Link>
          </div>
          <div className='flex gap-2'>
            <Link href={`/boards/${params.id}/edit`}>
              <Button variant='outline' size='sm' className='gap-1'>
                <Edit className='h-4 w-4' />
                Düzenle
              </Button>
            </Link>
            <Button variant='destructive' size='sm' className='gap-1'>
              <Trash2 className='h-4 w-4' />
              Sil
            </Button>
          </div>
        </div>

        <div className='relative overflow-hidden rounded-lg'>
          <div
            className='h-40 bg-cover bg-center'
            style={{
              backgroundImage: `url('${board.coverImage || 'https://source.unsplash.com/random/1200x400?gradient'}')`
            }}
          >
            <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black/50'></div>
          </div>
          <div className='absolute bottom-4 left-4 flex items-end gap-4'>
            <Avatar className='border-background h-16 w-16 border-4'>
              <AvatarImage src={board.profileImage} alt={board.name} />
              <AvatarFallback>
                {board.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='text-white'>
              <h1 className='text-2xl font-bold'>{board.name}</h1>
              <div className='flex items-center gap-2'>
                <Badge variant='secondary'>{localizeType(board.type)}</Badge>
                {board.code && (
                  <div className='text-xs opacity-80'>Kod: {board.code}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>Genel Bakış</TabsTrigger>
            <TabsTrigger value='students'>Öğrenciler</TabsTrigger>
            <TabsTrigger value='posts'>Gönderiler</TabsTrigger>
            <TabsTrigger value='settings'>Ayarlar</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Board Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <dt className='text-muted-foreground'>Oluşturulma:</dt>
                      <dd>{formatDate(board.createdAt)}</dd>
                    </div>
                    <div className='flex justify-between'>
                      <dt className='text-muted-foreground'>Son Güncelleme:</dt>
                      <dd>{formatDate(board.updatedAt)}</dd>
                    </div>
                    <div className='flex justify-between'>
                      <dt className='text-muted-foreground'>Durum:</dt>
                      <dd>
                        <Badge
                          variant={
                            board.status === 'active'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {board.status === 'active' ? 'Aktif' : 'Pasif'}
                        </Badge>
                      </dd>
                    </div>
                    <div className='flex justify-between'>
                      <dt className='text-muted-foreground'>Slug:</dt>
                      <dd className='font-mono text-xs'>{board.slug}</dd>
                    </div>
                    {board.parentName && (
                      <div className='flex justify-between'>
                        <dt className='text-muted-foreground'>Üst Board:</dt>
                        <dd>
                          <Link
                            href={`/boards/${board.parentId}`}
                            className='text-blue-600 hover:underline'
                          >
                            {board.parentName}
                          </Link>
                        </dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    İstatistikler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {board.studentCount.toLocaleString('tr-TR')}
                  </div>
                  <p className='text-muted-foreground text-xs'>Öğrenci</p>
                  <div className='mt-4 text-2xl font-bold'>
                    {board.postCount.toLocaleString('tr-TR')}
                  </div>
                  <p className='text-muted-foreground text-xs'>Gönderi</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Hızlı İşlemler
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <Button variant='outline' className='w-full justify-start'>
                    İstatistikleri İndir
                  </Button>
                  <Button variant='outline' className='w-full justify-start'>
                    Öğrencileri Listele
                  </Button>
                  <Button variant='outline' className='w-full justify-start'>
                    Gönderileri Görüntüle
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='students' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Öğrenci Listesi</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Öğrenci listesi burada görüntülenecek</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='posts' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Gönderiler</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Gönderi listesi burada görüntülenecek</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='settings' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Board Ayarları</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Board ayarları burada görüntülenecek</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
