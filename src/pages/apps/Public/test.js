import Button from '../../../components/button/Button';
import Headline from '../../../components/headline/Headline';
import Link from 'next/link';

export default () =>
  <div className='example'>
    Hello World!
	<Headline />
	<Button />
	<Link
		href="/apps/Public"
		as="/"
	>
		<a>Index Page</a>
	</Link>
  </div>
