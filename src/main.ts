import axios from "axios";

interface jsonType {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: {
    color: string;
    type: string;
  };
  domain: string;
  ip: string;
  address: {
    address: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    postalCode: string;
    state: string;
  };
  macAddress: string;
  university: string;
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  company: {
    address: {
      address: string;
      city: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      postalCode: string;
      state: string;
    };
    department: string;
    name: string;
    title: string;
  };
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: {
    coin: string;
    wallet: string;
    network: string;
  };
}

interface DepartmentType {
  male: number;
  female: number;
  ageRange: string;
  hair: {
    Black: number;
    Blond: number;
    Chestnut: number;
    Brown: number;
  };
  addressUser: {
    [key: string]: string;
  };
}

type JsonObjectType = {
  [key: string]: DepartmentType;
};

const calculateAge = (ageRange: string, age: number) => {
  if (ageRange === "") {
    return `${String(age)}-`;
  }
  let range = ageRange.split("-");
  if (ageRange[ageRange.length - 1] === "-") {
    let oldAge = range[0];
    if (Number(oldAge) > age) {
      return `${String(age)}-${oldAge}`;
    } else if (Number(oldAge) < age) {
      return `${oldAge}-${String(age)}`;
    } else {
      return ageRange;
    }
  }
  let numberArray = [];
  for (let i = 0; i < range.length; i++) {
    numberArray.push(Number(range[i]));
  }
  numberArray.push(age);
  numberArray.sort((a, b) => {
    return a - b;
  });
  return `${numberArray[0]}-${numberArray[2]}`;
};

const transformJson = (json: jsonType[]) => {
  let jsonObject: JsonObjectType = {};
  json.map((item: jsonType) => {
    const fullName = `${item.firstName} ${item.lastName}`;
    let templatNewData: DepartmentType = {
      male: 0,
      female: 0,
      ageRange: "",
      hair: {
        Black: 0,
        Blond: 0,
        Chestnut: 0,
        Brown: 0,
      },
      addressUser: {},
    };
    const key: string = item.company.department;
    if (!jsonObject[key]) {
      jsonObject[item.company.department] = templatNewData;
    }
    if (item.gender === "male") {
      jsonObject[item.company.department].male += 1;
    } else {
      jsonObject[item.company.department].female += 1;
    }
    if (item.hair.color === "Black") {
      jsonObject[item.company.department].hair.Black += 1;
    } else if (item.hair.color === "Blond") {
      jsonObject[item.company.department].hair.Blond += 1;
    } else if (item.hair.color === "Chestnut") {
      jsonObject[item.company.department].hair.Chestnut += 1;
    } else if (item.hair.color === "Brown") {
      jsonObject[item.company.department].hair.Brown += 1;
    }
    jsonObject[item.company.department].addressUser[
      fullName
    ] = `${item.address.address}`;
    jsonObject[item.company.department].ageRange = calculateAge(
      jsonObject[item.company.department].ageRange,
      item.age
    );
  });
  console.log(jsonObject);
};

const callApi = async () => {
  await axios.get("https://dummyjson.com/users").then((res) => {
    transformJson(res.data.users);
  });
};

callApi();
