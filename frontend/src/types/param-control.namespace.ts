// значения настраиваемых параметров 

export namespace ParamControl {

  export type Type = {
    text: string,
    value: number | string,
    active: boolean,
    focus: boolean,
  };

  export const NnParam: Type = {
      text: "NN",
      value: "eye-god",
      active: false,
      focus: false
  };

  export const OpticParam: Type[] = [
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
    },
    {
      text: "NN",
      value: "eye-god",
      active: false,
      focus: false
    }
  ];
  
  export const TermalParam: Type[] = [
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
      text: "Объекты",
      value: "color-swapper",
      active: false,
      focus: false
    },
    {
      text: "NN",
      value: "eye-god",
      active: false,
      focus: false
    }
  ];
}

