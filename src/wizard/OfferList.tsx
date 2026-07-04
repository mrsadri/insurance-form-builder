// Offer list shown after the RFQ wizard is submitted: renders the deferred insurer/tier
// options (from OFFERS) as comparable offer cards. This is the RFQ → Offer List step;
// picking a card would begin the RFS (issuance) flow.
import { OFFERS, type OfferOption } from '../presets/insurance'

interface OfferListProps {
  productId: string
}

export function OfferList({ productId }: OfferListProps) {
  const offers = OFFERS[productId]
  if (!offers || offers.length === 0) return null

  return (
    <div className="offer-list">
      <div className="offer-list-head">
        <div className="eyebrow"><span className="k">offers</span> <span>{`{ ${offers.length} پیشنهاد }`}</span></div>
        <h3>پیشنهادهای بیمه</h3>
        <p className="desc">بر اساس اطلاعات فرم، این شرکت‌ها می‌توانند نرخ ارائه دهند. یکی را برای صدور انتخاب کنید.</p>
      </div>
      <div className="offer-grid">
        {offers.map((o, i) => (
          <OfferCard key={`${o.insurer}-${o.plan ?? i}`} offer={o} suggested={i === 0} />
        ))}
      </div>
    </div>
  )
}

function OfferCard({ offer, suggested }: { offer: OfferOption; suggested?: boolean }) {
  return (
    <div className={`offer-card${suggested ? ' offer-card--suggested' : ''}`}>
      {suggested && <span className="offer-flag">پیشنهاد ما</span>}
      <div className="offer-card-top">
        <span className="offer-logo">{offer.insurer.slice(0, 2)}</span>
        <div className="offer-id">
          <div className="offer-insurer">بیمه {offer.insurer}</div>
          {offer.plan && <div className="offer-plan">{offer.plan}</div>}
        </div>
      </div>
      {offer.note && <div className="offer-note">{offer.note}</div>}
      <div className="offer-price">
        <span className="offer-price-label">حق بیمه</span>
        <span className="offer-price-val">استعلام نرخ</span>
      </div>
      <button className="btn btn-primary offer-cta">انتخاب و ادامه</button>
    </div>
  )
}
