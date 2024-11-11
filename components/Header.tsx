import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

const Header = ({ children, className }: HeaderProps) => {

	return (
		<div className={cn('header', className)}>
			<Link href={"/"} className='md:flex-1'>
				<Image src={'/assets/icons/logo.svg'} alt='logo with name' width={120} height={32} className='hidden md:block' />
			</Link>
			<Link href={"/"} className='md:hidden'>
				<Image src={'/assets/icons/logo-icon.svg'} alt='logo with name' width={32} height={32} className='mr-2 md:hidden' />
			</Link>
			{children}
		</div>
	)
}

export default Header