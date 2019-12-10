/* eslint-disable */

function nc_addDecimal(value,decimals=18,precision=1,base=false){
     if (value == null)
         return null;

      if (value < 0)
         return value;

     var num = new BigNumber(value);
     var digits = new BigNumber(10);
     var shift = digits.pow(decimals);
     if(num.isGreaterThan(shift)|| base){
        return nc_numFormatterACSensitive(num.toFixed());
     }else{
        return num.toFixed();//nc_numFormatterAionCoin(num.toFixed(),8);
     }
 }

 let val1 = 1000000000000;

it('renders welcome message', () => {
  //const { getByText } = render(<App />);
  //expect(getByText('Welcome to React')).toBeInTheDocument();
  expect(nc_addDecimal(val1)).toBe('grapefruit');
});