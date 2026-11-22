import type { Route } from './+types/home';
import { Link } from '~/design-system';
import { Placeholder } from '~/components/Placeholder';
import { CATEGORIES } from '~/lib/categories';
import { pageMeta, SITE } from '~/lib/site';
import site from '~/styles/site.module.css';

export function meta({}: Route.MetaArgs) {
  return pageMeta(undefined, 'TODO(copy): home page meta description');
}

export default function Home() {
  return (
    <>
      <h1>Serving remotely and in the Kansas City Metro</h1>
      <Placeholder>short, personal introduction from Ryan.</Placeholder>

      <div className={site.paths}>
        <section className={site.path} aria-labelledby="shop-heading">
          <h2 id="shop-heading">Shop by mail</h2>
          <Placeholder>
            one or two sentences about ordering products online.
          </Placeholder>
          <ul role="list" className={`list-reset ${site.inlineList}`}>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link to={`/products/${c.slug}`}>{c.label}</Link>
              </li>
            ))}
          </ul>
          <p>
            <Link to="/products" variant="button">
              All products
            </Link>
          </p>
        </section>

        <section className={site.service} aria-labelledby="services-heading">
          <h2 id="services-heading">Local services in {SITE.location}</h2>
          <p className={`${site.badge} ${site.badgeService}`}>
            By appointment, in person
          </p>
          <Placeholder>one or two sentences about local services.</Placeholder>
          <p>
            <Link to="/services" variant="button">
              Local services
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
