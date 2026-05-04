interface MarkerInfoCardProps {
  name?: string;
}

const MarkerInfoCard = ({ name }: MarkerInfoCardProps) => {
  return (
    <div className="marker-info-card absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded shadow">
      {name ?? "Marker Info"}
    </div>
  );
};

export default MarkerInfoCard;
