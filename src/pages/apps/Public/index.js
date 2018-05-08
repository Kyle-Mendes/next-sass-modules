import Link from 'next/link';
import Button from '../../../components/button/Button';

export default () =>
  <div className='example'>
    Hello World!
	<Button />
	<Link
		href="/apps/Public/test"
		as="/test"
	>
		<a>Test Page</a>
	</Link>
  </div>
