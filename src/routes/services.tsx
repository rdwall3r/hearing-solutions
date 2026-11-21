import type { Route } from "./+types/services";
import { Link } from "~/design-system";
import { Placeholder } from "~/components/Placeholder";
import { LOCAL_SERVICE_VALUE } from "~/lib/order";
import { pageMeta, SITE } from "~/lib/site";
import site from "~/styles/site.module.css";

export function meta({}: Route.MetaArgs) {
  return pageMeta("Local services", "TODO(copy): local services meta description");
}

// Ids are linked from product pages (e.g. /services#otc-programming).
const SERVICES = [
  { id: "hearing-tests", title: "Hearing tests" },
  { id: "otc-programming", title: "OTC hearing aid programming" },
  { id: "earmolds", title: "Ear impressions, custom earmolds and hearing protection" },
  { id: "cleaning-repair", title: "Cleaning and minor repair" },
] as const;

export default function Services() {
  return (
    <>
      <h1>Local services</h1>
      <p className={`${site.badge} ${site.badgeService}`}>
        In person, by appointment, in {SITE.location}. Not mail order.
      </p>
      <Placeholder>
        intro to local services: where, when, and how appointments work.
      </Placeholder>

      <ul role="list" className={`list-reset ${site.serviceList}`}>
        {SERVICES.map((s) => (
          <li key={s.id}>
            <section id={s.id} className={site.service} aria-labelledby={`${s.id}-heading`}>
              <h2 id={`${s.id}-heading`}>{s.title}</h2>
              <Placeholder>what this service includes, how long it takes, and the cost.</Placeholder>
            </section>
          </li>
        ))}
      </ul>

      <h2>Booking an appointment</h2>
      <Placeholder>how to book (form, phone, or text) and any scheduling notes.</Placeholder>
      <p>
        <Link to={`/order?product=${LOCAL_SERVICE_VALUE}`} variant="button">
          Ask about an appointment
        </Link>
      </p>
    </>
  );
}
