
const CartDetail = () => {


  return (
    <div className=" cardDetailsContainer pt-24 bg-color-white">
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr className="flex gap-16 w-screen px-4">
              <th scope="col" className="pl-4 py-3 rounded-tl-xl">
                Product name
              </th>
              <th scope="col" className=" py-3">
                Qty
              </th>
              <th scope="col" className=" py-3 rounded-tr-xl">
                Price
              </th>
              <th scope="col" className=" py-3 rounded-tr-xl">
                Total
              </th>
              <th scope="col" className=" py-3 rounded-tr-xl">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="pl-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex flex-col items-center gap-2 w-max"
              >
                <img src="../src/assets/user.png" alt="" /><p>Apple MacBook Pro 17"</p>
              </th>
              <td className=" py-4">1</td>
              <td className=" py-4">$2999</td>
              <td className=" py-4">$2999</td>
              <td className=" py-4">X</td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="pl-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Microsoft Surface Pro
              </th>
              <td className=" py-4">1</td>
              <td className=" py-4">$1999</td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="pl-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Magic Mouse 2
              </th>
              <td className=" py-4">1</td>
              <td className=" py-4">$99</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="font-semibold text-gray-900 dark:text-white bg-white rounded-b-lg">
              <th scope="row" className="pl-4 py-3 text-base rounded-bl-xl">
                Total
              </th>
              <td className="pr-4 py-3">3</td>
              <td className="pr-4 py-3 rounded-br-xl">21,000</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
export default CartDetail