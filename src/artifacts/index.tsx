import { useState, useEffect } from 'react';
import { FileText, Search, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Folder } from 'lucide-react';

interface Artifact {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: Artifact[]; // For folders
}


const ArtifactList = () => {
  // 2. Add currentPath state
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 3. Replace loadArtifacts function with this updated version
  const loadArtifacts = async () => {
    try {
      // Get all .tsx files in artifacts directory except index.tsx
      const modules = import.meta.glob('./**/*.tsx', { eager: true });

      const artifactMap: Record<string, Artifact> = {
        '/': { name: 'root', path: '/', type: 'folder', children: [] }
      };

      // Process all paths
      Object.keys(modules)
          .filter(path => !path.endsWith('index.tsx'))
          .forEach(path => {
            // Normalize path
            const normalizedPath = path.replace('./', '');
            // Split path parts
            const parts = normalizedPath.split('/');

            // Create folder hierarchy
            let currentFolder = '/';
            for (let i = 0; i < parts.length - 1; i++) {
              const folderName = parts[i];
              const folderPath = parts.slice(0, i + 1).join('/');

              if (!artifactMap[folderPath]) {
                // Create folder if it doesn't exist
                artifactMap[folderPath] = {
                  name: folderName,
                  path: folderPath,
                  type: 'folder',
                  children: []
                };

                // Add to parent
                artifactMap[currentFolder].children?.push(artifactMap[folderPath]);
              }

              currentFolder = folderPath;
            }

            // Create file
            const fileName = parts[parts.length - 1].replace('.tsx', '');
            const filePath = normalizedPath;

            const fileArtifact: Artifact = {
              name: fileName,
              path: filePath,
              type: 'file'
            };

            // Add file to its folder
            artifactMap[currentFolder].children?.push(fileArtifact);
          });

      // Set artifacts based on current path
      const currentFolder = currentPath.length === 0 ? '/' : currentPath.join('/');
      const currentArtifacts = artifactMap[currentFolder]?.children || [];
      setArtifacts(currentArtifacts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error loading artifacts:', err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadArtifacts();
  }, [currentPath]);

  const handleFolderClick = (folder: Artifact) => {
    setCurrentPath([...currentPath, folder.name]);
  };
  const navigateTo = (index: number) => {
    setCurrentPath(currentPath.slice(0, index));
  };

  const filteredArtifacts = artifacts.filter(artifact =>
    artifact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Available Artifacts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input
                type="text"
                placeholder="Search artifacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
            />
          </div>
          <div className="flex items-center mb-4 text-sm">
            <button
                onClick={() => setCurrentPath([])}
                className="text-blue-500 hover:underline"
            >
              Home
            </button>
            {currentPath.map((folder, index) => (
                <div key={index} className="flex items-center">
                  <span className="mx-1">/</span>
                  <button
                      onClick={() => navigateTo(index + 1)}
                      className="text-blue-500 hover:underline"
                  >
                    {folder}
                  </button>
                </div>
            ))}
          </div>


          {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
              </div>
          ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4"/>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
          ) : filteredArtifacts.length > 0 ? (
              <div className="space-y-2">
                {filteredArtifacts.map((artifact) => (
                    <div className="space-y-2">
                      {currentPath.length > 0 && (
                          <button
                              onClick={() => setCurrentPath(currentPath.slice(0, currentPath.length - 1))}
                              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <ArrowLeft className="h-5 w-5 mr-3 text-muted-foreground"/>
                            <span className="font-medium">Go back</span>
                          </button>
                      )}
                    </div>
                ))}

                {filteredArtifacts.map((artifact) => (
                    artifact.type === 'folder' ? (
                        <button
                            key={artifact.path}
                            onClick={() => handleFolderClick(artifact)}
                            className="flex items-center w-full p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Folder className="h-5 w-5 mr-3 text-muted-foreground"/>
                          <span className="font-medium">{artifact.name}</span>
                        </button>
                    ) : (
                        <Link
                            key={artifact.path}
                            to={`/${artifact.path.replace('.tsx', '').replace(/\\/g, '/')}`}
                            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <FileText className="h-5 w-5 mr-3 text-muted-foreground"/>
                          <span className="font-medium">{artifact.name}</span>
                        </Link>
                    )
                ))}
              </div>
          ) : (
              <div className="text-center py-8 text-muted-foreground">
                No artifacts found
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
};

export default ArtifactList;
