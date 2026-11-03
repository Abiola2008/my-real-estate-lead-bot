import { useState } from "react";
import MayveeLogo from "../components/MayveeLogo";

type Property = {
  id: number;
  title: string;
  location: string;
  locationKey: string;
  propertyType: string;
  purpose: string;
  price: number;
  priceDisplay: string;
  image: string;
  imageAlt: string;
  badge: string;
  features: string[];
};

const properties: Property[] = [
  {
    id: 1,
    title: "Modern Family Home",
    location: "Lekki, Lagos State",
    locationKey: "lagos",
    propertyType: "house",
    purpose: "buy",
    price: 85000000,
    priceDisplay: "₦85,000,000",
    image: "/images/properties/property-house.jpeg",
    imageAlt: "Modern family home in Lekki, Lagos",
    badge: "For Sale",
    features: ["4 Bedrooms", "4 Bathrooms", "320 sqm"],
  },
  {
    id: 2,
    title: "Residential Land Opportunity",
    location: "Abeokuta, Ogun State",
    locationKey: "ogun",
    propertyType: "land",
    purpose: "invest",
    price: 18000000,
    priceDisplay: "₦18,000,000",
    image: "/images/properties/property-land.jpeg",
    imageAlt:
      "Residential land opportunity in Abeokuta, Ogun State",
    badge: "Land",
    features: ["600 sqm", "Residential", "Investment"],
  },
  {
    id: 3,
    title: "Premium Apartment",
    location: "Abuja / FCT",
    locationKey: "abuja",
    propertyType: "apartment",
    purpose: "invest",
    price: 120000000,
    priceDisplay: "₦120,000,000",
    image: "/images/properties/property-apartment.jpeg",
    imageAlt: "Premium apartment in Abuja",
    badge: "Investment",
    features: ["3 Bedrooms", "3 Bathrooms", "210 sqm"],
  },
];

type Filters = {
  location: string;
  propertyType: string;
  purpose: string;
  budget: string;
};

const emptyFilters: Filters = {
  location: "",
  propertyType: "",
  purpose: "",
  budget: "",
};

function matchesBudget(
  price: number,
  budget: string
) {
  switch (budget) {
    case "under-20m":
      return price < 20000000;

    case "20m-50m":
      return (
        price >= 20000000 &&
        price <= 50000000
      );

    case "50m-100m":
      return (
        price > 50000000 &&
        price <= 100000000
      );

    case "100m-250m":
      return (
        price > 100000000 &&
        price <= 250000000
      );

    case "250m-plus":
      return price > 250000000;

    default:
      return true;
  }
}

function buildPropertyEnquiryLink(
  property: Property
) {
  const params = new URLSearchParams({
    intent: "buy",
    property: property.title,
    location: property.location,
    price: property.priceDisplay,
  });

  return `/assistant?${params.toString()}`;
}

export default function HomePage() {
  const [filters, setFilters] =
    useState<Filters>(emptyFilters);

  const [activeFilters, setActiveFilters] =
    useState<Filters>(emptyFilters);

  const [hasSearched, setHasSearched] =
    useState(false);

  const filteredProperties =
    properties.filter((property) => {
      const locationMatches =
        !activeFilters.location ||
        property.locationKey ===
          activeFilters.location;

      const typeMatches =
        !activeFilters.propertyType ||
        property.propertyType ===
          activeFilters.propertyType;

      const purposeMatches =
        !activeFilters.purpose ||
        property.purpose ===
          activeFilters.purpose;

      const budgetMatches =
        matchesBudget(
          property.price,
          activeFilters.budget
        );

      return (
        locationMatches &&
        typeMatches &&
        purposeMatches &&
        budgetMatches
      );
    });

  function handleSearch() {
    setActiveFilters(filters);
    setHasSearched(true);

    setTimeout(() => {
      document
        .getElementById("properties")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  function handleResetSearch() {
    setFilters(emptyFilters);
    setActiveFilters(emptyFilters);
    setHasSearched(false);
  }

  return (
    <main className="home-page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay" />

        <div className="hero-content">
          <p className="hero-eyebrow">
            MAYVEE Homes & Properties
          </p>

          <h1>
            Find a Place to Call Home.
            <span> Or Create One.</span>
          </h1>

          <p className="hero-description">
            Discover quality homes, lands and
            investment opportunities, sell your
            property with confidence, or let MAYVEE
            help bring your development vision to life.
          </p>

          <div className="hero-actions">
            <a
              href="#properties"
              className="btn btn-primary"
            >
              Explore Properties
            </a>

            <a
              href="/assistant?intent=sell"
              className="btn btn-outline"
            >
              Sell With MAYVEE
            </a>

            <a
              href="/assistant?intent=build"
              className="btn btn-outline"
            >
              Build With MAYVEE
            </a>
          </div>

          <div className="hero-locations">
            <span>Lagos</span>
            <span>Ogun</span>
            <span>Oyo</span>
            <span>Osun</span>
            <span>Abuja</span>
          </div>
        </div>
      </section>

      {/* PROPERTY SEARCH */}
      <section className="property-search-section">
        <div className="property-search-card">
          <div className="search-field">
            <label htmlFor="location">
              Location
            </label>

            <select
              id="location"
              value={filters.location}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  location:
                    event.target.value,
                })
              }
            >
              <option value="">
                Any location
              </option>

              <option value="lagos">
                Lagos State
              </option>

              <option value="ogun">
                Ogun State
              </option>

              <option value="oyo">
                Oyo State
              </option>

              <option value="osun">
                Osun State
              </option>

              <option value="abuja">
                Abuja / FCT
              </option>
            </select>
          </div>

          <div className="search-field">
            <label htmlFor="property-type">
              Property Type
            </label>

            <select
              id="property-type"
              value={
                filters.propertyType
              }
              onChange={(event) =>
                setFilters({
                  ...filters,
                  propertyType:
                    event.target.value,
                })
              }
            >
              <option value="">
                Any property type
              </option>

              <option value="house">
                House
              </option>

              <option value="apartment">
                Apartment
              </option>

              <option value="land">
                Land
              </option>

              <option value="commercial">
                Commercial Property
              </option>

              <option value="investment">
                Investment Property
              </option>
            </select>
          </div>

          <div className="search-field">
            <label htmlFor="purpose">
              What are you looking to do?
            </label>

            <select
              id="purpose"
              value={filters.purpose}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  purpose:
                    event.target.value,
                })
              }
            >
              <option value="">
                Buy or invest
              </option>

              <option value="buy">
                Buy
              </option>

              <option value="invest">
                Invest
              </option>
            </select>
          </div>

          <div className="search-field">
            <label htmlFor="budget">
              Budget
            </label>

            <select
              id="budget"
              value={filters.budget}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  budget:
                    event.target.value,
                })
              }
            >
              <option value="">
                Any budget
              </option>

              <option value="under-20m">
                Under ₦20M
              </option>

              <option value="20m-50m">
                ₦20M - ₦50M
              </option>

              <option value="50m-100m">
                ₦50M - ₦100M
              </option>

              <option value="100m-250m">
                ₦100M - ₦250M
              </option>

              <option value="250m-plus">
                ₦250M+
              </option>
            </select>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSearch}
          >
            Search Properties
          </button>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section
        className="featured-properties-section"
        id="properties"
      >
        <div className="section-heading">
          <p className="section-label">
            {hasSearched
              ? "PROPERTY SEARCH"
              : "FEATURED PROPERTIES"}
          </p>

          <h2>
            {hasSearched
              ? `${filteredProperties.length} ${
                  filteredProperties.length ===
                  1
                    ? "property"
                    : "properties"
                } found`
              : "Discover properties selected for you"}
          </h2>

          <p>
            {hasSearched
              ? "These properties match the search criteria you selected."
              : "Explore a growing collection of homes, land and investment opportunities across our key locations."}
          </p>

          {hasSearched && (
            <button
              type="button"
              className="reset-search-btn"
              onClick={
                handleResetSearch
              }
            >
              Clear search
            </button>
          )}
        </div>

        {filteredProperties.length >
        0 ? (
          <div className="property-grid">
            {filteredProperties.map(
              (property) => (
                <article
                  className="property-card"
                  key={property.id}
                >
                  <div className="property-image-wrap">
                    <img
                      src={
                        property.image
                      }
                      alt={
                        property.imageAlt
                      }
                      className="property-image"
                    />

                    <span className="property-image-badge">
                      {
                        property.badge
                      }
                    </span>
                  </div>

                  <div className="property-card-content">
                    <p className="property-location">
                      {
                        property.location
                      }
                    </p>

                    <h3>
                      {property.title}
                    </h3>

                    <div className="property-features">
                      {property.features.map(
                        (feature) => (
                          <span
                            key={
                              feature
                            }
                          >
                            {feature}
                          </span>
                        )
                      )}
                    </div>

                    <div className="property-card-footer">
                      <div>
                        <span className="property-price-label">
                          Asking Price
                        </span>

                        <strong className="property-price">
                          {
                            property.priceDisplay
                          }
                        </strong>
                      </div>

                      <a
                        href={buildPropertyEnquiryLink(
                          property
                        )}
                        className="property-enquire-btn"
                      >
                        Enquire
                      </a>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        ) : (
          <div className="property-no-results">
            <span className="no-results-mark">
              MV
            </span>

            <h3>
              No matching properties yet
            </h3>

            <p>
              We don't currently have a listed
              property matching all of those
              filters.
            </p>

            <div className="no-results-actions">
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={
                  handleResetSearch
                }
              >
                Clear Search
              </button>

              <a
                href="/assistant?intent=buy"
                className="btn btn-primary"
              >
                Tell MAYVEE What You Need
              </a>
            </div>
          </div>
        )}
      </section>

      {/* SERVICES */}
      <section className="services-section">
        <div className="section-heading">
          <p className="section-label">
            OUR SERVICES
          </p>

          <h2>
            What can MAYVEE help you do?
          </h2>

          <p>
            Whether you're searching for your
            next property, selling an existing
            property, or planning a new
            development, MAYVEE is here to help.
          </p>
        </div>

        <div className="service-grid">
          <article className="service-card">
            <span className="service-number">
              01
            </span>

            <h3>
              Buy Property
            </h3>

            <p>
              Explore homes, apartments, lands
              and investment opportunities
              selected around your needs,
              preferred location and budget.
            </p>

            <a href="/assistant?intent=buy">
              Start a buying enquiry →
            </a>
          </article>

          <article
            className="service-card"
            id="sell"
          >
            <span className="service-number">
              02
            </span>

            <h3>
              Sell Property
            </h3>

            <p>
              Tell us about your property and
              let MAYVEE help connect it with
              qualified buyers and serious
              investors.
            </p>

            <a href="/assistant?intent=sell">
              Sell with MAYVEE →
            </a>
          </article>

          <article
            className="service-card"
            id="build"
          >
            <span className="service-number">
              03
            </span>

            <h3>
              Build & Develop
            </h3>

            <p>
              Already own land or have a
              development idea? Share your
              plans with MAYVEE and start a
              conversation about bringing your
              property vision to life.
            </p>

            <a href="/assistant?intent=build">
              Discuss your project →
            </a>
          </article>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="locations-section">
        <div className="section-heading">
          <p className="section-label">
            EXPLORE LOCATIONS
          </p>

          <h2>
            Property opportunities across key
            locations
          </h2>

          <p>
            Explore homes, land and development
            opportunities across our growing
            coverage areas.
          </p>
        </div>

        <div className="location-grid">
          <article className="location-card">
            <h3>Lagos State</h3>

            <p>
              Homes, apartments, lands and
              premium investment opportunities.
            </p>
          </article>

          <article className="location-card">
            <h3>Ogun State</h3>

            <p>
              Residential properties, land and
              emerging development opportunities.
            </p>
          </article>

          <article className="location-card">
            <h3>Oyo State</h3>

            <p>
              Homes, land and growing property
              opportunities across key locations.
            </p>
          </article>

          <article className="location-card">
            <h3>Osun State</h3>

            <p>
              Property opportunities for
              homeowners, families and investors.
            </p>
          </article>

          <article className="location-card">
            <h3>Abuja / FCT</h3>

            <p>
              Premium residential, land and
              investment opportunities in the
              capital.
            </p>
          </article>
        </div>
      </section>

      {/* ABOUT */}
      <section
        className="about-section"
        id="about"
      >
        <div className="about-content">
          <p className="section-label">
            ABOUT MAYVEE
          </p>

          <h2>
            More than property.
            A better way to move forward.
          </h2>

          <p>
            MAYVEE Homes & Properties is a
            modern real estate company focused
            on helping individuals, families and
            investors make confident property
            decisions.
          </p>

          <p>
            From finding the right home or land
            to selling an existing property and
            exploring new development
            opportunities, MAYVEE combines
            personal service with smart
            technology to make the property
            journey simpler.
          </p>

          <div className="about-highlights">
            <div>
              <strong>Buy</strong>
              <span>
                Find the right property.
              </span>
            </div>

            <div>
              <strong>Sell</strong>
              <span>
                Reach serious buyers.
              </span>
            </div>

            <div>
              <strong>Build</strong>
              <span>
                Bring your vision to life.
              </span>
            </div>
          </div>
        </div>

        <img
          src="/images/properties/hero-house.jpeg"
          alt="MAYVEE Homes and Properties"
          className="about-image"
        />
      </section>

      {/* WHY MAYVEE */}
      <section className="why-mayvee-section">
        <div className="section-heading">
          <p className="section-label">
            WHY MAYVEE
          </p>

          <h2>
            Property decisions should feel
            simpler
          </h2>
        </div>

        <div className="why-grid">
          <article>
            <h3>
              Property-Focused Guidance
            </h3>

            <p>
              We help you understand your
              options and move forward with
              greater clarity.
            </p>
          </article>

          <article>
            <h3>
              Multiple Property Services
            </h3>

            <p>
              Buy, sell or develop property
              through one connected property
              experience.
            </p>
          </article>

          <article>
            <h3>
              Smart Lead Support
            </h3>

            <p>
              Our digital property assistant
              helps capture your requirements
              quickly and accurately.
            </p>
          </article>

          <article>
            <h3>
              Growing Location Coverage
            </h3>

            <p>
              Explore opportunities across
              Lagos, Ogun, Oyo, Osun and Abuja.
            </p>
          </article>
        </div>
      </section>

      {/* BUILD */}
      <section className="development-section">
        <div className="development-content">
          <p className="section-label">
            BUILD WITH MAYVEE
          </p>

          <h2>
            Already have land? Let's discuss
            what you can build.
          </h2>

          <p>
            Whether you're considering a family
            home, residential development,
            apartments or another property
            project, tell us what you have in
            mind.
          </p>

          <a
            href="/assistant?intent=build"
            className="btn btn-primary"
          >
            Start a Build Enquiry
          </a>
        </div>
      </section>

      {/* SELL */}
      <section className="sell-section">
        <div className="sell-content">
          <p className="section-label">
            SELL WITH MAYVEE
          </p>

          <h2>
            Have a property you want to sell?
          </h2>

          <p>
            Share your property details with
            MAYVEE and let us understand what
            you're selling, where it's located
            and the type of buyer you're looking
            for.
          </p>

          <a
            href="/assistant?intent=sell"
            className="btn btn-primary"
          >
            Submit a Property
          </a>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section
        className="contact-section"
        id="contact"
      >
        <div className="contact-content">
          <p className="section-label">
            START A CONVERSATION
          </p>

          <h2>
            Tell us what you want to achieve.
          </h2>

          <p>
            Buying, selling or building? Our
            MAYVEE Property Assistant can help
            us understand your needs and guide
            you to the right next step.
          </p>

          <div className="contact-actions">
            <a
              href="/assistant"
              className="btn btn-primary"
            >
              Talk to MAYVEE
            </a>

            <a
              href="#properties"
              className="btn btn-outline-dark"
            >
              Browse Properties
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-brand">
          <MayveeLogo small />

          <p className="footer-description">
            MAYVEE Homes & Properties helps
            individuals, families and investors
            buy, sell and develop property with
            confidence.
          </p>
        </div>

        <div className="footer-column">
          <h4>
            Quick Links
          </h4>

          <div className="footer-links">
            <a href="#properties">
              Properties
            </a>

            <a href="/assistant?intent=sell">
              Sell Property
            </a>

            <a href="/assistant?intent=build">
              Build & Develop
            </a>

            <a href="#about">
              About MAYVEE
            </a>

            <a href="/assistant">
              Property Assistant
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4>
            Locations
          </h4>

          <div className="footer-locations">
            <span>
              Lagos State
            </span>

            <span>
              Ogun State
            </span>

            <span>
              Oyo State
            </span>

            <span>
              Osun State
            </span>

            <span>
              Abuja / FCT
            </span>
          </div>
        </div>

        <div className="footer-column footer-contact">
          <h4>
            Contact
          </h4>

          <div className="footer-contact-list">
            <a
              href="https://wa.me/2347015282006"
              target="_blank"
              rel="noreferrer"
            >
              <strong>
                WhatsApp / Call:
              </strong>

              <span>
                07015282006
              </span>
            </a>

            <a href="mailto:abiolavictoria2008@gmail.com">
              <strong>
                Email:
              </strong>

              <span>
                abiolavictoria2008@gmail.com
              </span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} MAYVEE
            Homes & Properties. All rights reserved.
          </p>

          <p>
            Property • Investment • Living
          </p>
        </div>
      </footer>
    </main>
  );
}