'use client';

export default function SortFilter() {
  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h3 className="font-bold mb-2">ソート</h3>
      <div>
        <label htmlFor="sort" className="block text-sm font-semibold mb-2">並び替え</label>
        <select id="sort" className="block w-full border rounded-md p-2">
          <option value="newest">新着順</option>
          <option value="popular">人気順</option>
        </select>
      </div>
    </div>
  );
}
