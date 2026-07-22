import {
  MapPin,
  Clock3,
  Star
} from "lucide-react";

import "../styles/ProviderDetails.css";

const servicesdetails = [
  {
    id: 1,
    title: "Signature Cut",
    desc: "Consultation, cut & style.",
    time: "60 min",
    price: "$85",
  },
  {
    id: 2,
    title: "Balayage",
    desc: "Hand-painted highlights.",
    time: "180 min",
    price: "$240",
  },
  {
    id: 3,
    title: "Blowout",
    desc: "Wash + style.",
    time: "45 min",
    price: "$55",
  },
  {
    id: 4,
    title: "Hair Spa",
    desc: "Relaxing hair treatment.",
    time: "90 min",
    price: "$120",
  },
];

export default function ProviderDetails() {
  return (
    <div className="provider-page">

      <div className="provider-banner">
        <img
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200"
          alt=""
        />
      </div>

      <div className="provider-info">

        <div>

          <h1>Willow Hair Studio</h1>

          <div className="provider-meta">

            <span>Salon</span>

            <span>
              <MapPin size={15} />
              Brooklyn, NY
            </span>

          </div>

          <p>
            A calm, plant-filled corner of Brooklyn specializing in
            soft haircuts, balayage, and slow color work.
          </p>

        </div>

        <div className="rating-box">
          <Star fill="#A78BFA" size={16} />
          <strong>4.9</strong>
          <small>(218)</small>
        </div>

      </div>

      <h2 className="service-heading">
        Services
      </h2>

      <div className="service-grid">

        {servicesdetails.map((item) => (

          <div className="service-card" key={item.id}>

            <div>

              <h3>{item.title}</h3>

              <p>{item.desc}</p>

              <div className="bottom">

                <span>
                  <Clock3 size={15} />
                  {item.time}
                </span>

                <strong>{item.price}</strong>

              </div>

            </div>

            <button>Book now</button>

          </div>

        ))}

      </div>

    </div>
  );
}