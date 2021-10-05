// import {appImages} from '../assets';

//Validations
const signUpValdation = (username, email, password) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (username === '' || email === '' || password === '') {
    return {
      success: false,
      message: 'Please Enter All Fields to Proceed',
    };
  } else if (password?.length < 6) {
    return {
      success: false,
      message: 'Please enter at least 6 digits password',
    };
  } else if (!reg.test(email)) {
    return {
      success: false,
      message: 'Please enter valid email',
    };
  } else {
    return {
      success: true,
      message: '',
    };
  }
};

const loginValidation = (email, password) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email === '' || password === '') {
    return {
      success: false,
      message: 'Please Enter All Fields to Proceed',
    };
  } else if (password?.length < 6) {
    return {
      success: false,
      message: 'Please enter your 6 digits password',
    };
  } else if (!reg.test(email)) {
    return {
      success: false,
      message: 'Please enter valid email',
    };
  } else {
    return {
      success: true,
      message: '',
    };
  }
};
const dummyservice = [
  {
    id: 1,
    icon: {
      name: 'gas-station-outline',
      type: 'material-community',
      status: '99 %',
    },
    message: 'Overall range',
    value: '373 mi',
  },
];
const dummyartival2 = [
  {
    id: 1,
    icon: {
      name: 'call-outline',
      type: 'ionicon',
    },
    icon2: {
      name: 'tools',
      type: 'material-community',
    },
    text: 'Concierge Services',
    message: 'Call Concierage Services',
  },
];
const dummyArticles = [
  {
    source: {
      id: null,
      name: '',
    },
    // author: 'Keris Lahiff',
    title: 'Dummy Article',
    // description:
    //   'Stocks shook off political tensions to rally to new highs. Trader Nancy Tengler said there\'s no disconnect: The market is "looking forward to future earnings."',
    // urlToImage: appImages.item1,
    publishedAt: '2021-01-08T11:59:00Z',
    // content:
    // 'Washington and Wall Street are seemingly existing in two different realities.\r\nAfter a chaotic day at the Capitol on Wednesday, the three major indexes rallied to new records, undeterred by continued… [+2349 chars]',
  },
];
const slides = [
  {
    key: 1,
    title: 'Comment fonctionne Ze Barber?',
    text: 'Ze Barber utilise un numero USSD pour faciliter vos payment électronique.',
  },
  {
    key: 2,
    title: 'Envoyer de l’argent a vos coopératives avec aise.',
    text: 'Ze Barber vous permet d’executer plusieurs paiements en une fois, très utile pour les redevance des coopératives.',
  },
  {
    key: 3,
    title: 'Sauvegardez vos informations en toute sécurité.',
    text: 'Sauvegardez vos information de paiement en tout securité sur votre plateforme pour plus de rapidité à chaque visits',
  },
  {
    key: 4,
    title: 'Ze Barber fonctionne hors connexion',
    text: 'Meme sans être connecte a internet, faites vos paiement avec Ze Barber',
  },
];
export {
  signUpValdation,
  loginValidation,
  slides,
  dummyArticles,
  dummyservice,
  dummyartival2,
};
