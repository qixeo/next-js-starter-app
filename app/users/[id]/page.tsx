import prisma from '@/prisma/client';
import {
  Button,
  Flex,
  Grid,
  Text,
  Heading,
  Link,
  Separator,
} from '@radix-ui/themes';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/auth/authOptions';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

const UserDetailPage = async ({ params: { id } }: Props) => {
  // const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) notFound();

  return (
    <>
      <Flex justify="between" my="5">
        <Heading size="5">Personal Information</Heading>
        <Link href={`/users/edit/${user.id}`}>
          <Button>Edit Profile</Button>
        </Link>
      </Flex>
      <Grid columns="2" gap="1">
        <Flex align="start">
          <Text weight="bold">Name:</Text>
        </Flex>
        <Flex align="start">
          <Text>{user.name}</Text>
        </Flex>
        <Flex align="start">
          <Text weight="bold">Email:</Text>
        </Flex>
        <Flex align="start">
          <Text>{user.email}</Text>
        </Flex>
      </Grid>
      <Separator my="5" size="4" />
      <Flex justify="between" my="5">
        <Heading size="5">Password</Heading>
        {user.hashedPassword && (
          <Link href={`/users/change-password/${user.id}`}>
            <Button>Change Password</Button>
          </Link>
        )}
      </Flex>
      <Grid columns="2" gap="1">
        <Flex align="start">
          <Text weight="bold">Password:</Text>
        </Flex>
        <Flex align="start">
          {(user.hashedPassword && <Text>••••••••</Text>) || (
            <Button>Add a Password</Button>
          )}
        </Flex>
      </Grid>
    </>
  );
};

export default UserDetailPage;
