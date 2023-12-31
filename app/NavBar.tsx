'use client';

import { Skeleton } from '@/app/components';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, {
  Fragment,
  PropsWithChildren,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from 'react';
import classnames from 'classnames';
import { useSession } from 'next-auth/react';
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react';
import {
  Avatar,
  Box,
  Button,
  Container,
  DropdownMenu,
  Flex,
  Separator,
  Text,
} from '@radix-ui/themes';
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from '@heroicons/react/20/solid';
import Image from 'next/image';
import logo from '@/public/images/logo.png';
import { CaretDownIcon } from '@radix-ui/react-icons';

const products = [
  {
    name: 'Analytics',
    description: 'Get a better understanding of your traffic',
    href: '#',
    icon: ChartPieIcon,
  },
  {
    name: 'Engagement',
    description: 'Speak directly to your customers',
    href: '#',
    icon: CursorArrowRaysIcon,
  },
  {
    name: 'Security',
    description: 'Your customers’ data will be safe and secure',
    href: '#',
    icon: FingerPrintIcon,
  },
  {
    name: 'Integrations',
    description: 'Connect with third-party tools',
    href: '#',
    icon: SquaresPlusIcon,
  },
  {
    name: 'Automations',
    description: 'Build strategic funnels that will convert',
    href: '#',
    icon: ArrowPathIcon,
  },
];
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  // Closes mobile menu on path change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Signout keyboard shortcut
  const handleKeyPress = useCallback(
    (event: { key: any; metaKey: any; ctrlKey: any }) => {
      if (
        (event.metaKey && event.key === 'Backspace') ||
        (event.ctrlKey && event.key === 'Backspace')
      )
        window.location.href = '/api/auth/signout';
    },
    []
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <header className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Logo</span>
            <Image src={logo} alt="Logo" className="h-8 w-auto" priority />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <NavLinks />
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <AuthStatus />
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Logo</span>
              <Image src={logo} alt="Logo" className="h-8 w-auto" priority />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        Product
                        <ChevronDownIcon
                          className={classNames(
                            open ? 'rotate-180' : '',
                            'h-5 w-5 flex-none'
                          )}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {[...products, ...callsToAction].map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          >
                            {item.name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <MobileNavLinks func={setMobileMenuOpen} />
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

const NavLinks = () => {
  const { status, data: session } = useSession();
  const currentPath = usePathname();

  let links = [
    { label: 'Dashboard', href: '/', requiresAuth: true },
    { label: 'Users', href: '/users', requiresAuth: true },
    { label: 'Contact', href: '/contact' },
  ];
  if (status === 'unauthenticated') {
    links = links.filter((link) => !link.requiresAuth);
  }

  return (
    <div className="hidden lg:flex lg:gap-x-12">
      {links.map((link) => (
        <Link
          className={classnames({
            'gap-x-1 text-sm font-semibold nav-link': true,
            '!text-zinc-900': link.href === currentPath,
          })}
          href={link.href}
          key={link.href}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

const MobileNavLinks = (props: any) => {
  const { status, data: session } = useSession();
  const currentPath = usePathname();

  let links = [
    { label: 'Dashboard', href: '/', requiresAuth: true },
    { label: 'Users', href: '/users', requiresAuth: true },
    { label: 'Contact', href: '/contact' },
  ];
  if (status === 'unauthenticated') {
    links = links.filter((link) => !link.requiresAuth);
  }

  return (
    <>
      {links.map((link) => (
        <Link
          className={classnames({
            '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50':
              true,
            '!text-zinc-900': link.href === currentPath,
          })}
          href={link.href}
          key={link.href}
        >
          {link.label}
        </Link>
      ))}
      <AuthStatusMobile />
    </>
  );
};

const AuthStatus = () => {
  const { status, data: session } = useSession();
  const currentPath = usePathname();

  if (status === 'loading') return <Skeleton width="5rem" />;

  if (status === 'unauthenticated')
    return (
      <>
        <Flex align="center">
          <Link
            className={classnames({
              'gap-x-1 text-sm font-semibold nav-link mr-5': true,
              '!text-zinc-900': '/signin' === currentPath,
            })}
            href="/signin"
          >
            Log In
          </Link>
          <Button
            className={classnames({
              '!hidden': '/register' === currentPath,
            })}
          >
            <Link href="/register">Sign Up</Link>
          </Button>
        </Flex>
      </>
    );

  // const fullName = session!.user.name;

  // const array = fullName!.split(' ');
  // let initials = '?';

  // if (fullName!.length > 0) {
  //   if (array.length > 1) {
  //     const firstName = fullName!.split(' ')[0];
  //     const lastName = fullName!.split(' ')[1];
  //     initials = firstName.charAt(0) + lastName.charAt(0);
  //   } else if (array.length === 1) {
  //     initials = fullName!.charAt(0);
  //   }
  // }

  return (
    <>
      {/* TODO: Dropdown doesn't trigger with fallback */}
      {/* <Box>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Avatar
              src={session!.user!.image!}
              fallback={
                <Box>
                  <svg viewBox="0 0 64 64" fill="currentColor">
                    <path d="M41.5 14c4.687 0 8.5 4.038 8.5 9s-3.813 9-8.5 9S33 27.962 33 23 36.813 14 41.5 14zM56.289 43.609C57.254 46.21 55.3 49 52.506 49c-2.759 0-11.035 0-11.035 0 .689-5.371-4.525-10.747-8.541-13.03 2.388-1.171 5.149-1.834 8.07-1.834C48.044 34.136 54.187 37.944 56.289 43.609zM37.289 46.609C38.254 49.21 36.3 52 33.506 52c-5.753 0-17.259 0-23.012 0-2.782 0-4.753-2.779-3.783-5.392 2.102-5.665 8.245-9.472 15.289-9.472S35.187 40.944 37.289 46.609zM21.5 17c4.687 0 8.5 4.038 8.5 9s-3.813 9-8.5 9S13 30.962 13 26 16.813 17 21.5 17z" />
                  </svg>
                </Box>
              }
              size="2"
              radius="full"
              className="cursor-pointer"
              referrerPolicy="no-referrer"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Label>
              <Text size="2">{session!.user.email}</Text>
            </DropdownMenu.Label>
            <DropdownMenu.Item>
              <Link href="/users/">{session!.user.name}</Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item shortcut="⌘ L">
              <Link href="/api/auth/signout">Log out</Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Box> */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="soft">
            Account
            <CaretDownIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item asChild>
            <Link href={`/users/${session!.user.id}`}>
              {session!.user!.name}
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item shortcut="⌘ ⌫" color="red" asChild>
            <Link href="/api/auth/signout">Log out</Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};

const AuthStatusMobile = (props: any) => {
  const { status, data: session } = useSession();

  const currentPath = usePathname();

  if (status === 'loading') return <Skeleton width="5rem" />;

  if (status === 'unauthenticated')
    return (
      <>
        <Link
          className={classnames({
            '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50':
              true,
            '!text-zinc-900': '/signin' === currentPath,
          })}
          href="/signin"
        >
          Log In
        </Link>
        <Link
          className={classnames({
            '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50':
              true,
            '!text-zinc-900': '/register' === currentPath,
          })}
          href="/register"
        >
          Sign Up
        </Link>
      </>
    );

  return (
    <>
      <Link
        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
        href={`/users/${session!.user.id}`}
        onClick={() => props.func(false)}
      >
        {session!.user!.name}
      </Link>
      <Link
        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
        href="/api/auth/signout"
      >
        Log out
      </Link>
    </>
  );
};

export default NavBar;
