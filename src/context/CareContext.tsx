import {
   createContext,
   useCallback,
   useContext,
   useEffect,
   useMemo,
   useState,
} from 'react';

import { apiRequest } from '../lib/api';
import { useAuth } from './AuthContext';

type CareOwner = {
   id: string;
   name: string;
   email: string;
   relationship: 'owner' | 'shared';
};

type Collaborator = {
   id: string;
   userId: string;
   name: string;
   email: string;
};

type CareContextValue = {
   careOwners: CareOwner[];
   collaborators: Collaborator[];
   selectedCareOwnerId: string;
   setSelectedCareOwnerId: (id: string) => void;
   collaboratorEmail: string;
   setCollaboratorEmail: (value: string) => void;
   addCollaborator: () => Promise<void>;
   deleteCollaborator: (id: string) => Promise<void>;
   careError: string;
};

const CareContext = createContext<CareContextValue | undefined>(undefined);

type CareProviderProps = {
   children: React.ReactNode;
};

export function CareProvider({ children }: CareProviderProps) {
   const { isAuthenticated } = useAuth();
   const [careOwners, setCareOwners] = useState<CareOwner[]>([]);
   const [selectedCareOwnerId, setSelectedCareOwnerId] = useState('');
   const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
   const [collaboratorEmail, setCollaboratorEmail] = useState('');
   const [careError, setCareError] = useState('');

   useEffect(() => {
      if (!isAuthenticated) {
         setCareOwners([]);
         setSelectedCareOwnerId('');
         setCollaborators([]);
         setCollaboratorEmail('');
         setCareError('');
         return;
      }

      const loadOwners = async () => {
         try {
            const owners = await apiRequest<CareOwner[]>('/care-team/owners', {
               auth: true,
            });

            setCareOwners(owners);
            setSelectedCareOwnerId((prev) => prev || owners[0]?.id || '');
            setCareError('');
         } catch (err) {
            setCareError(
               err instanceof Error
                  ? err.message
                  : 'Failed to load care owners',
            );
         }
      };

      void loadOwners();
   }, [isAuthenticated]);

   useEffect(() => {
      if (!selectedCareOwnerId) {
         setCollaborators([]);
         return;
      }

      const loadCollaborators = async () => {
         try {
            const collaboratorsData = await apiRequest<Collaborator[]>(
               `/care-team/collaborators?ownerId=${selectedCareOwnerId}`,
               {
                  auth: true,
               },
            );

            setCollaborators(collaboratorsData);
         } catch {
            setCollaborators([]);
         }
      };

      void loadCollaborators();
   }, [selectedCareOwnerId]);

   const addCollaborator = useCallback(async () => {
      const email = collaboratorEmail.trim().toLowerCase();

      if (!email || !selectedCareOwnerId) return;

      const created = await apiRequest<Collaborator>(
         '/care-team/collaborators',
         {
            method: 'POST',
            auth: true,
            body: JSON.stringify({
               careOwnerId: selectedCareOwnerId,
               email,
            }),
         },
      );

      setCollaborators((prev) => {
         const hasExisting = prev.some((item) => item.id === created.id);

         if (hasExisting) return prev;
         return [...prev, created];
      });

      setCollaboratorEmail('');
   }, [collaboratorEmail, selectedCareOwnerId]);

   const deleteCollaborator = useCallback(
      async (id: string) => {
         if (!selectedCareOwnerId) return;

         await apiRequest(`/care-team/collaborators/${id}`, {
            method: 'DELETE',
            auth: true,
         });

         setCollaborators((prev) => prev.filter((item) => item.id !== id));
      },
      [selectedCareOwnerId],
   );

   const value = useMemo(
      () => ({
         careOwners,
         collaborators,
         selectedCareOwnerId,
         setSelectedCareOwnerId,
         collaboratorEmail,
         setCollaboratorEmail,
         addCollaborator,
         deleteCollaborator,
         careError,
      }),
      [
         careOwners,
         collaborators,
         selectedCareOwnerId,
         collaboratorEmail,
         addCollaborator,
         deleteCollaborator,
         careError,
      ],
   );

   return <CareContext.Provider value={value}>{children}</CareContext.Provider>;
}

export function useCare() {
   const context = useContext(CareContext);
   if (!context) {
      throw new Error('useCare must be used within a CareProvider');
   }

   return context;
}
