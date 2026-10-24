import { Card } from '../ui/Card.jsx';
import { HighlightText } from '../landing/HighlightText.jsx';

export function ConversionKpi({ rate = 0 }) {
  return (
    <Card className="flex flex-col justify-between p-6">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[#717171] font-mono mb-3">
          Conversion Rate
        </p>

        <div className="font-display text-7xl md:text-8xl tracking-tight uppercase leading-none py-2">
          <HighlightText animateOnMount={true}>
            {`${rate}%`}
          </HighlightText>
        </div>
      </div>

      <div className="pt-4 border-t border-[#222222]/40 text-xs font-mono text-[#717171] flex items-center justify-between">
        <span>Converted / Total leads</span>
        <span className="text-[10px] uppercase tracking-widest text-[#8A8A8A]">
          Qualified Outcome
        </span>
      </div>
    </Card>
  );
}
