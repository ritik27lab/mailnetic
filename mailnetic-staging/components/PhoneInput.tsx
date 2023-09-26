import { useTelephone, countries, CountryCode } from "use-telephone";

export default function PhoneInput({ setPhone }) {
  const telephone = useTelephone();

  return (
    <div style={{ width: "100%", backgroundColor: "green" }}>
      {/* <img src={telephone.flag} alt="Flag of the current selected country" /> */}
      <input
        placeholder="(xxx) xxx-xxxx"
        value={telephone.value}
        onChange={telephone.onChange}
        className="input-default"
        style={{ paddingLeft: "50px" }}
      />
      <select
        className="w-14 h-7"
        value={telephone.country}
        onChange={(e) => {
          telephone.onChangeCountry(e.target.value as CountryCode);
        }}
        style={{ backgroundColor: "red", left: 0 }}
      >
        {countries.map((country) => {
          return (
            <option key={country.name} value={country.code}>
              {country.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
