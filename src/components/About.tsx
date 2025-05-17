// components/ContributorList.tsx
type Member = {
  Nama: string;
  Link?: string;
};

interface ContributorListProps {
  team: Member[];
}

export default function About({ team }: ContributorListProps) {
  return (
    <ul className="flex flex-wrap gap-4 mt-4">
      {team.map((member, i) => (
        <li key={i}>
          {member.Link ? (
            <a
              href={member.Link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-700 text-white px-3 py-1 rounded-full hover:bg-blue-800 transition"
            >
              {member.Nama}
            </a>
          ) : (
            <span className="inline-block bg-blue-700 text-white px-3 py-1 rounded-full">
              {member.Nama}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
