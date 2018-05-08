import Headline from '../components/headline/Headline';
import Link from 'next/link';

export default () =>
  <div className='example'>
    Hello World!
	<Headline />
	<Link href="/"><a>Index Page</a></Link>
  </div>
