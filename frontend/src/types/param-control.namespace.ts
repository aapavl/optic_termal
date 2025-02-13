// значения настраиваемых параметров 

export namespace ParamControl {

  export type TypeNumber = {
    text: string,
    value: number,
    active: boolean,
    focus: boolean,
  };

  export type TypeBool = {
    text: string,
    image: string,
    active: boolean,
    focus: boolean,
  };

  export const OpticParamNumbers: TypeNumber[] = [
    {
      text: "Масштаб",
      value: 1.0,
      active: false,
      focus: false
    },
    {
      text: "Фокус",
      value: 1.0,
      active: false,
      focus: false
    },
    {
      text: "Апертура",
      value: 1.0,
      active: false,
      focus: false
    }
  ];
  
  export const OpticParamImages: TypeBool[] = [
    {
      text: "NN",
      image: "eye-god",
      active: false,
      focus: false
    }
  ];
  
  export const TermalParamNumbers: TypeNumber[] = [
    {
      text: "Масштаб",
      value: 1.0,
      active: false,
      focus: false
    },
    {
      text: "Фокус",
      value: 1.0,
      active: false,
      focus: false
    }
  ];
  export const TermalParamImages: TypeBool[] = [
    {
      text: "Объекты",
      image: "color-swapper",
      active: false,
      focus: false
    },
    {
      text: "NN",
      image: "eye-god",
      active: false,
      focus: false
    }
  ];
}

