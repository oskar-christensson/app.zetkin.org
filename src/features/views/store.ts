import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DeleteFolderReport } from 'pages/api/views/deleteFolder';
import { ViewTreeData } from 'pages/api/views/tree';
import { remoteItem, remoteList, RemoteList } from 'utils/storeUtils';
import { ZetkinView, ZetkinViewFolder } from './components/types';

export interface ViewsStoreSlice {
  folderList: RemoteList<ZetkinViewFolder>;
  recentlyCreatedFolder: ZetkinViewFolder | null;
  viewList: RemoteList<ZetkinView>;
}

const initialState: ViewsStoreSlice = {
  folderList: remoteList(),
  recentlyCreatedFolder: null,
  viewList: remoteList(),
};

const viewsSlice = createSlice({
  initialState,
  name: 'views',
  reducers: {
    allItemsLoad: (state) => {
      state.folderList.isLoading = true;
      state.viewList.isLoading = true;
    },
    allItemsLoaded: (state, action: PayloadAction<ViewTreeData>) => {
      const { folders, views } = action.payload;
      const timestamp = new Date().toISOString();
      state.folderList = remoteList(folders);
      state.folderList.loaded = timestamp;
      state.viewList = remoteList(views);
      state.viewList.loaded = timestamp;
    },
    folderCreate: (state) => {
      state.folderList.isLoading = true;
      state.recentlyCreatedFolder = null;
    },
    folderCreated: (state, action: PayloadAction<ZetkinViewFolder>) => {
      const folder = action.payload;
      state.folderList.isLoading = false;
      state.folderList.items.push(remoteItem(folder.id, { data: folder }));
      state.recentlyCreatedFolder = folder;
    },
    folderDeleted: (state, action: PayloadAction<DeleteFolderReport>) => {
      const { foldersDeleted, viewsDeleted } = action.payload;
      state.folderList.items = state.folderList.items.filter(
        (item) => !foldersDeleted.includes(item.id)
      );
      state.viewList.items = state.viewList.items.filter(
        (item) => !viewsDeleted.includes(item.id)
      );
    },
    folderUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [id, mutating] = action.payload;
      const item = state.folderList.items.find((item) => item.id == id);
      if (item) {
        item.mutating = mutating;
      }

      // Mutating means that creating the "recently created folder"
      // is no longer the most recent action takeing.
      state.recentlyCreatedFolder = null;
    },
    folderUpdated: (
      state,
      action: PayloadAction<[ZetkinViewFolder, string[]]>
    ) => {
      const [folder, mutating] = action.payload;
      const item = state.folderList.items.find((item) => item.id == folder.id);
      if (item) {
        item.mutating = item.mutating.filter(
          (attr) => !mutating.includes(attr)
        );
        if (item.data) {
          item.data = folder;
        }
      }
    },
    viewCreate: (state) => {
      state.viewList.isLoading = true;
    },
    viewCreated: (state, action: PayloadAction<ZetkinView>) => {
      const view = action.payload;
      state.viewList.isLoading = false;
      state.viewList.items.push(
        remoteItem(view.id, {
          data: view,
        })
      );
    },
    viewDeleted: (state, action: PayloadAction<number>) => {
      const viewId = action.payload;
      state.viewList.items = state.viewList.items.filter(
        (item) => item.id != viewId
      );
    },
    viewUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [id, mutating] = action.payload;
      const item = state.viewList.items.find((item) => item.id == id);
      if (item) {
        item.mutating = mutating;
      }
    },
    viewUpdated: (state, action: PayloadAction<[ZetkinView, string[]]>) => {
      const [view, mutating] = action.payload;
      const item = state.viewList.items.find((item) => item.id == view.id);
      if (item) {
        item.mutating = item.mutating.filter(
          (attr) => !mutating.includes(attr)
        );
        if (item.data) {
          item.data = view;
        }
      }
    },
  },
});

export default viewsSlice;
export const {
  allItemsLoad,
  allItemsLoaded,
  folderCreate,
  folderCreated,
  folderDeleted,
  folderUpdate,
  folderUpdated,
  viewCreate,
  viewCreated,
  viewDeleted,
  viewUpdate,
  viewUpdated,
} = viewsSlice.actions;