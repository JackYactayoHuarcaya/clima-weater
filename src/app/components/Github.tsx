import imgGithub from "../../assets/github.svg";
export const Github = () => {
  return (
    <a href="">
      <div
        className="flex items-center gap-1 cursor-default border p-2 pl-5 pr-5 
      rounded border-gray-600 hover:bg-gray-900 hover:opacity-90 duration-300"
      >
        <p className="text-lg">Github</p>
        <img src={imgGithub} alt="" />
      </div>
    </a>
  );
};
