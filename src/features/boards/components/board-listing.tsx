import { Board } from '@/constants/data';
import { fakeBoards } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { BoardTable } from './board-tables';
import { columns } from './board-tables/columns';

type BoardListingPage = {};

export default async function BoardListingPage({}: BoardListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const types = searchParamsCache.get('type');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(types && { type: types })
  };

  const data = await fakeBoards.getBoards(filters);
  const totalBoards = data.total_boards;
  const boards: Board[] = data.boards;

  return (
    <BoardTable data={boards} totalItems={totalBoards} columns={columns} />
  );
}
