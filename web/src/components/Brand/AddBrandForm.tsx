import React from "react";

const AddBrandForm = () => {
  return (
    <form className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Brand Name"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      />
      <select className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white">
        <option>Sand</option>
      </select>
      <input type="file" accept="image/*" className="w-full" />
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
      >
        Save
      </button>
    </form>
  );
};

export default AddBrandForm;
